import {client, dbName, noticeCollection, opendataCollection} from "../repositories/db";
import {getData, getDayliFile} from "./downloader";
import {reloadGeoJson} from "./ymaps-router";

const reloadTimer = 86400000 //1 day;

export const startSheduler = () =>{
    setInterval(downloadOpenData,reloadTimer);
}

//download opendata and wrote to DB
export const downloadOpenData  = async () => {

    //download json opendata
    let json = await getData(getDayliFile());
    console.log("JSON File downloaded");
    json = json['listObjects'];
    console.log('Notices in opendata file: ' + json.length);
    for (let i = 0; i < json.length; i++) {
       await client.db(dbName).collection(opendataCollection)
            .updateOne(json[i], { $setOnInsert: {'loaded': false}},{ upsert: true });
    }

    //Read opendata by DB
    let notLoadedList = await client.db(dbName).collection(opendataCollection).find({loaded: false}).toArray();

    for (let i = 0; i < notLoadedList.length; i++) {
        //download json notice by url
        let json = await getData(notLoadedList[i]['href']);

        //wrote json notice to DB
        if (!json.undefined) {
            await client.db(dbName).collection(noticeCollection).insertOne(json);
            await client.db(dbName).collection(opendataCollection).updateOne(notLoadedList[i],{$set:{loaded: true}});
        }
    }

    notLoadedList = await client.db(dbName).collection(opendataCollection).find({loaded: false}).toArray();
    console.log('not loaded:' + notLoadedList.length);
    await reloadGeoJson();
}

