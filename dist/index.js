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
const express_1 = __importDefault(require("express"));
const node_path_1 = __importDefault(require("node:path"));
const db_1 = require("./repositories/db");
const notify_router_1 = require("./routes/notify-router");
const app = (0, express_1.default)();
const port = process.env.PORT || 3005;
//index.html path
const indexFilePath = node_path_1.default.join(__dirname, '..', 'public/index.html');
app.use('/', express_1.default.static(node_path_1.default.join(__dirname, '..', 'public')));
//GET request start page
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('send start page index.html ' + indexFilePath);
    res.sendFile(indexFilePath);
}));
//POST request
app.post("/", (req, res) => {
    console.log(req.query.action);
    res.sendStatus(200);
});
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.runDb)();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
    (0, notify_router_1.startSheduler)();
    yield (0, notify_router_1.downloadOpenData)();
});
//Start DB and port listening
startApp();
module.exports = app;
