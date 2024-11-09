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
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadOpenData = exports.startSheduler = void 0;
const db_1 = require("../repositories/db");
const downloader_1 = require("./downloader");
const ymaps_router_1 = require("./ymaps-router");
const reloadTimer = 86400000; //1 day;
const startSheduler = () => {
    setInterval(exports.downloadOpenData, reloadTimer);
};
exports.startSheduler = startSheduler;
//download opendata and wrote to DB
const downloadOpenData = () => __awaiter(void 0, void 0, void 0, function* () {
    //download json opendata
    let json = yield (0, downloader_1.getData)((0, downloader_1.getDayliFile)());
    console.log("JSON File downloaded");
    json = json['listObjects'];
    console.log('Notices in opendata file: ' + json.length);
    for (let i = 0; i < json.length; i++) {
        yield db_1.client.db(db_1.dbName).collection(db_1.opendataCollection)
            .updateOne(json[i], { $setOnInsert: { 'loaded': false } }, { upsert: true });
    }
    //Read opendata by DB
    let notLoadedList = yield db_1.client.db(db_1.dbName).collection(db_1.opendataCollection).find({ loaded: false }).toArray();
    for (let i = 0; i < notLoadedList.length; i++) {
        //download json notice by url
        let json = yield (0, downloader_1.getData)(notLoadedList[i]['href']);
        //wrote json notice to DB
        if (!json.undefined) {
            yield db_1.client.db(db_1.dbName).collection(db_1.noticeCollection).insertOne(json);
            yield db_1.client.db(db_1.dbName).collection(db_1.opendataCollection).updateOne(notLoadedList[i], { $set: { loaded: true } });
        }
    }
    notLoadedList = yield db_1.client.db(db_1.dbName).collection(db_1.opendataCollection).find({ loaded: false }).toArray();
    console.log('not loaded:' + notLoadedList.length);
    yield (0, ymaps_router_1.reloadGeoJson)();
});
exports.downloadOpenData = downloadOpenData;
