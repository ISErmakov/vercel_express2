"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const node_path_1 = __importDefault(require("node:path"));
const fs = __importStar(require("node:fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const db_1 = require("./repositories/db");
const app = (0, express_1.default)();
const port = process.env.PORT || 3005;
const indexFilePath = node_path_1.default.join(__dirname, '..', 'public/index.html');
app.get("/", (req, res) => {
    console.log('send start page index.html ' + indexFilePath);
    res.sendFile(indexFilePath);
    getData().then(r => (console.log("JSON File downloaded")));
});
function getData() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://torgi.gov.ru/new/opendata/7710568760-notice/data-20241025T0000-20241026T0000-structure-20240401.json";
        const response = yield (0, node_fetch_1.default)(url);
        const json = yield response.json();
        console.log(json);
    });
}
function downloadXMLFeed() {
    return __awaiter(this, void 0, void 0, function* () {
        // function for download the file to
        // a temporary location
        let FILE_PATH = 'input.json';
        let FILE_URL = 'https://torgi.gov.ru/new/opendata/7710568760-notice/data-20241025T0000-20241026T0000-structure-20240401.json';
        let fileStream = fs.createWriteStream(FILE_PATH, { encoding: "utf-8" });
        (0, node_fetch_1.default)(FILE_URL)
            .then((res) => {
            var _a;
            (_a = res.body) === null || _a === void 0 ? void 0 : _a.pipe(fileStream);
            fileStream.on("finish", () => {
                fileStream.close();
            });
        });
    });
}
/*
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    console.dir(req.url);
    const s3 = 'http://torgi.gov.ru/opendata/7710349494-torgi/data-20190712T0000-20190713T0000-structure-20130401T0000.xml'
    // sql.close();

    wget({
        url:  s3,
        //dest: './path/',      // destination path or path with filenname, default is ./
        timeout: 10000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
    }, function (error, res, body) {
        if (error) {
            console.log('--- error:');
            console.log(error);            // error encountered
        } else {
            console.dir('--- headers:');
            console.dir(res.headers); // response headers
            //console.log('--- body:');
            //console.log(body);             // content of package
        }
    });
    downloadNotifications('http://torgi.gov.ru/opendata/7710349494-torgi/data-20190712T0000-20190713T0000-structure-20130401T0000.xml',)
    //   zapusc1(body);
})
 */
app.post("/", (req, res) => {
    console.log(req.query.action);
    res.sendStatus(200);
});
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.runDb)();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
startApp();
module.exports = app;
