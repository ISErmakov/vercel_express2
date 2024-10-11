"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3003;
app.get("/", (req, res) => { res.send("Express on Vercel 3003"); });
//app.get("/", (req, res) => res.send("Express on Vercel!!!!!!!!!!!"));
app.listen(port, () => console.log("Server ready on port 3003WOW."));
module.exports = app;
/**
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
 */ 
