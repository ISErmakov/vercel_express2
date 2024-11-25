import fetch from "node-fetch";
import {client, dbName, noticeCollection, opendataCollection} from "../repositories/db";
import {reloadGeoJson} from "../service/geojson-transformer";


//download opendata and wrote to DB
export const downloadOpenData  = async () => {

    //download json opendata
    let json = await getData(getDayliFile());
    console.log("JSON File downloaded");
    json = json['listObjects'];
    console.log('Notices in opendata file: ' + json.length);
    for (let i = 0; i < json.length; i++) {
        //TO DO replace to db repo
        await client.db(dbName).collection(opendataCollection)
            .updateOne(json[i], { $setOnInsert: {'loaded': false}},{ upsert: true });
    }

    //Read opendata by DB
    //TO DO replace to db repo
    let notLoadedList = await client.db(dbName).collection(opendataCollection).find({loaded: false}).toArray();

    for (let i = 0; i < notLoadedList.length; i++) {
        //download json notice by url
        let json = await getData(notLoadedList[i]['href']);

        //wrote json notice to DB
        if (!json.undefined) {
            //TO DO replace to db repo
            await client.db(dbName).collection(noticeCollection).insertOne(json);
            await client.db(dbName).collection(opendataCollection).updateOne(notLoadedList[i],{$set:{loaded: true}});
        }
    }
    //TO DO replace to db repo
    notLoadedList = await client.db(dbName).collection(opendataCollection).find({loaded: false}).toArray();
    console.log('not loaded:' + notLoadedList.length);
    await reloadGeoJson();
}

export const getDayliFile = ():string => {
    let dateOne = new Date();
    let secondDay = format(dateOne);
    dateOne.setDate(dateOne.getDate()-1);
    let firstDay = format(dateOne);
    let dayliFileString = "https://torgi.gov.ru/new/opendata/7710568760-notice/data-"+
        firstDay+
        "T0000-"+
        secondDay+
        "T0000-structure-20240401.json";
    return dayliFileString;
}

//download json file by url
export async function getData(url: fetch.RequestInfo) {
    try {
        console.log("Trying download " + url);
        const response = await fetch(url);
        return response.json();
    }
    catch (error){
        let rn = Math.random();
        setTimeout(()=>{getData(url)},rn*10000);
        console.log(error);
        console.log(new Date());
    }
}

// formatDate
function format(inputDate: Date) {
    let date, month, year;

    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();

    date = date.toString().padStart(2, '0');
    month = month.toString().padStart(2, '0');

    return `${year}${month}${date}`;
}