const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const bodyParser = require("body-parser");
const authRouter = require("./routes/auth");


var app = express();

app.use(logger("dev"));
app.use(cookieParser())
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ extended: true,limit: '50mb' }));


app.use("/api/calc", authRouter);

app.use("/images", express.static("images"));
app.use("/js", express.static("js"));


app.use(express.static("client"));

app.get("/", (req, res, next) => {
    res.sendFile(
        path.resolve(__dirname, "client", "index.html")
    );
});

module.exports = app;
