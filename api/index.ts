import express from "express";

const app = express();
const port = process.env.PORT || 3005s


app.get("/", (req, res) => {res.send("Express on Vercel ${port}")});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app;