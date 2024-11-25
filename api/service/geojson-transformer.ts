import {client, dbName, noticeCollection, rightHolderOrgsCollection} from "../repositories/db";
import path from "node:path";
import fs from "node:fs";
import https from "node:https";
import {Filter} from "mongodb";

export const reloadGeoJson = async () => {
    const arr: {  "type": string,
        "id": number,
        "geometry":
            {
                "type": string,
                "coordinates": number[]
            },
        "properties":
            {
                "description": string,
                "iconCaption": string,
                "marker-color": string
            }
    }[] = [];
    //let filter: Filter<Document>;
    let filter = {$and:[
            {"exportObject.structuredObject.notice.lots.lotStatus":"PUBLISHED"},
            {"exportObject.structuredObject.notice.commonInfo.biddType.code":"178FZ"},
            {"exportObject.structuredObject.notice.lots.biddingObjectInfo.category.name":{$regex:"авто"}}
        ]};
    const json = await client.db(dbName).collection(noticeCollection).find(filter).toArray();
    try {
        console.log(json.length);
        for (let i = 0; i < Math.min(json.length, 1000); i++) {
            let coordinates: number[] = [];
            let coord: String = '';
            let rightHolderOrg = json[i].exportObject.structuredObject.notice.rightHolderInfo.rightHolderOrg;

            let organizationByINN = await client.db(dbName).collection(rightHolderOrgsCollection).find({'INN': rightHolderOrg.INN}).toArray();

            if (organizationByINN.length == 0) {
                let legalAddress = rightHolderOrg.legalAddress;
                console.log(legalAddress);
                coord = JSON.parse(await yandexapi(legalAddress))
                    .response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
                let coord2 = coord.split(' ');
                coordinates = [Number(coord2[0]), Number(coord2[1])];
                rightHolderOrg["coord"] = coordinates;
                console.log(rightHolderOrg);
                client.db(dbName).collection('rightHolderOrgs').insertOne(rightHolderOrg);
            } else coordinates = organizationByINN[0].coord;
            let lots =   json[i].exportObject.structuredObject.notice.lots;

                arr.push({
                    "type": "Feature",
                    "id": i,
                    "geometry":
                        {
                            "type": "Point",
                            "coordinates": coordinates
                        },
                    "properties":
                        {
                            "description": json[i].exportObject.structuredObject.notice.lots[0].lotName +
                                            ' <a href="' +
                                            json[i].exportObject.structuredObject.notice.commonInfo.href+
                                            '" target="_blank">Перейти к лоту</a>',
                            //"iconCaption": json[i].exportObject.structuredObject.notice.commonInfo.noticeNumber + lots.length + ' лот',
                            "iconCaption": lots.length + ' лот',
                            "marker-color": "#b51eff"
                        }

                });
        }
        console.log(arr.length);
        let json1 = {"type": "FeatureCollection",
            "features": arr };
        let path2 = path.join(__dirname,'..','..',"/public/geoObjects.geojson");
        fs.writeFileSync(path2, JSON.stringify(json1), {
            flag: 'w'});
        console.log('geoObjects.geojson wrote');
    }
    catch (e)
        {
            console.log(e);
        }


}

export const yandexapi = async (name: string):Promise<string> => {

    const url = 'https://geocode-maps.yandex.ru/1.x/?apikey=b9f53f78-fae7-46c8-bf3f-4855b3499b23&format=json&geocode='
        + encodeURIComponent(name);

    return new Promise((resolve) => {
        let data = ''

        https.get(url, res => {

            res.on('data', chunk => { data += chunk })

            res.on('end', () => {
                resolve(data);
            })
        })
    })

}
