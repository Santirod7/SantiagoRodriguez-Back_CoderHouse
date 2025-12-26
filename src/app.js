const path = require("path");
const express = require("express");
const { engine } = require("express-handlebars");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;