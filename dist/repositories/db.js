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
exports.rightHolderOrgsCollection = exports.noticeCollection = exports.opendataCollection = exports.dbName = exports.client = void 0;
exports.runDb = runDb;
const mongodb_1 = require("mongodb");
const mongoUri = process.env.mongoURI || "mongodb://localhost:27017";
exports.client = new mongodb_1.MongoClient(mongoUri);
exports.dbName = 'admin';
exports.opendataCollection = 'opendata';
exports.noticeCollection = 'notices';
exports.rightHolderOrgsCollection = 'rightHolderOrgs';
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.client.connect();
            yield exports.client.db("opendata").command({ "ping": 1 });
            console.log("success connect to db");
        }
        catch (error) {
            console.log("can't connect to db");
            yield exports.client.close();
        }
    });
}
