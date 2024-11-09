"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.yandexapi = exports.reloadGeoJson = void 0;
const db_1 = require("../repositories/db");
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_https_1 = __importDefault(require("node:https"));
const reloadGeoJson = () => __awaiter(void 0, void 0, void 0, function* () {
    const arr = [];
    //let filter: Filter<Document>;
    let filter = { $and: [
            { "exportObject.structuredObject.notice.lots.lotStatus": "PUBLISHED" },
            { "exportObject.structuredObject.notice.commonInfo.biddType.code": "178FZ" },
            { "exportObject.structuredObject.notice.lots.biddingObjectInfo.category.name": { $regex: "авто" } }
        ] };
    const json = yield db_1.client.db(db_1.dbName).collection(db_1.noticeCollection).find(filter).toArray();
    try {
        console.log(json.length);
        for (let i = 0; i < Math.min(json.length, 1000); i++) {
            let coordinates = [];
            let coord = '';
            let rightHolderOrg = json[i].exportObject.structuredObject.notice.rightHolderInfo.rightHolderOrg;
            let organizationByINN = yield db_1.client.db(db_1.dbName).collection(db_1.rightHolderOrgsCollection).find({ 'INN': rightHolderOrg.INN }).toArray();
            if (organizationByINN.length == 0) {
                let legalAddress = rightHolderOrg.legalAddress;
                console.log(legalAddress);
                coord = JSON.parse(yield (0, exports.yandexapi)(legalAddress))
                    .response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
                let coord2 = coord.split(' ');
                coordinates = [Number(coord2[0]), Number(coord2[1])];
                rightHolderOrg["coord"] = coordinates;
                console.log(rightHolderOrg);
                db_1.client.db(db_1.dbName).collection('rightHolderOrgs').insertOne(rightHolderOrg);
            }
            else
                coordinates = organizationByINN[0].coord;
            let lots = json[i].exportObject.structuredObject.notice.lots;
            arr.push({
                "type": "Feature",
                "id": i,
                "geometry": {
                    "type": "Point",
                    "coordinates": coordinates
                },
                "properties": {
                    "description": json[i].exportObject.structuredObject.notice.lots[0].lotName +
                        ' <a href="' +
                        json[i].exportObject.structuredObject.notice.commonInfo.href +
                        '" target="_blank">Перейти к лоту</a>',
                    //"iconCaption": json[i].exportObject.structuredObject.notice.commonInfo.noticeNumber + lots.length + ' лот',
                    "iconCaption": lots.length + ' лот',
                    "marker-color": "#b51eff"
                }
            });
        }
        console.log(arr.length);
        let json1 = { "type": "FeatureCollection",
            "features": arr };
        let path2 = node_path_1.default.join(__dirname, '..', '..', "/public/geoObjects.geojson");
        node_fs_1.default.writeFileSync(path2, JSON.stringify(json1), {
            flag: 'w'
        });
        console.log('geoObjects.geojson wrote');
    }
    catch (e) {
        console.log(e);
    }
});
exports.reloadGeoJson = reloadGeoJson;
const yandexapi = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'https://geocode-maps.yandex.ru/1.x/?apikey=b9f53f78-fae7-46c8-bf3f-4855b3499b23&format=json&geocode='
        + encodeURIComponent(name);
    return new Promise((resolve) => {
        let data = '';
        node_https_1.default.get(url, res => {
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                resolve(data);
            });
        });
    });
});
exports.yandexapi = yandexapi;
