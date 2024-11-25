import express from "express";
import path from "node:path";
import {runDb} from "./repositories/db"
import {startSheduler} from "./service/sheduler";
import {downloadOpenData} from "./service/downloader";

//express and port
const app = express();
const port = process.env.PORT || 3005;
//index.html path
const indexFilePath = path.join(__dirname,'..','public/index.html');

app.use(
    '/',
    express.static(path.join(__dirname,'..','public'))
);

const startApp = async() => {
    await runDb();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    });
    startSheduler();
    await downloadOpenData();
}


//Start DB and port listening
startApp();

//GET request start page
app.get("/", async (req, res) => {
    console.log('send start page index.html ' + indexFilePath);
    res.sendFile(indexFilePath);
});

//POST request
app.post("/",(req, res) =>{
    console.log(req.query.action);
    res.sendStatus(200);
});

module.exports = app;