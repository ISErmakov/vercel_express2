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
exports.getDayliFile = void 0;
exports.getData = getData;
const node_fetch_1 = __importDefault(require("node-fetch"));
const getDayliFile = () => {
    let dateOne = new Date();
    let secondDay = format(dateOne);
    dateOne.setDate(dateOne.getDate() - 1);
    let firstDay = format(dateOne);
    let dayliFileString = "https://torgi.gov.ru/new/opendata/7710568760-notice/data-" +
        firstDay +
        "T0000-" +
        secondDay +
        "T0000-structure-20240401.json";
    return dayliFileString;
};
exports.getDayliFile = getDayliFile;
//download json file by url
function getData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)(url);
            return response.json();
        }
        catch (error) {
            let rn = Math.random();
            setTimeout(() => { getData(url); }, rn * 10000);
            console.log(error);
            console.log(new Date());
        }
    });
}
// formatDate
function format(inputDate) {
    let date, month, year;
    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();
    date = date.toString().padStart(2, '0');
    month = month.toString().padStart(2, '0');
    return `${year}${month}${date}`;
}
