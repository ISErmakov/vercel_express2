import express from "express";

const app = express();
const port = process.env.PORT || 3003


app.get("/", (req, res) => {res.send("Express on Vercel 3003")});
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