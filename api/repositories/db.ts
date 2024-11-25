import { MongoClient } from 'mongodb'

//process.env.mongoURI = "mongodb://admin:my_password@23.177.184.17:8082";

const mongoUri =  process.env.mongoURI || "mongodb://localhost:27017";

export const client = new MongoClient(mongoUri);
export const dbName = 'admin';
export const opendataCollection = 'opendata';
export const noticeCollection = 'notices';
export const rightHolderOrgsCollection = 'rightHolderOrgs';

export async function runDb() {
    try {
        await client.connect();
        await client.db("opendata").command({"ping" : 1});
        console.log("success connect to db");
    }
    catch (error) {
        console.log("can't connect to db");
        await client.close();
    }
}

