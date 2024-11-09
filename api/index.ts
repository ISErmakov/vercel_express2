import express from "express";
import path from "node:path";
import {runDb} from "./repositories/db"
import {downloadOpenData, startSheduler} from "./routes/notify-router";
import {reloadGeoJson} from "./routes/ymaps-router";

const app = express();
const port = process.env.PORT || 3005;

//index.html path
const indexFilePath = path.join(__dirname,'..','public/index.html');

app.use(
    '/',
    express.static(path.join(__dirname,'..','public'))
);

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

module.exports = app;