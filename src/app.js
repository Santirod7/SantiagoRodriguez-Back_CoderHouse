const path = require("path");
const express = require("express");
const {engine} = require("express-handlebars");

// Managers y Routes
const productsRouter = require("./routes/products.routes.js");
const cartsRouter = require("./routes/cart.routes.js");
const viewsRouter = require("./routes/views.routes.js");

// Configuración de la app
const app = express();

app.use(express.static(path.join(__dirname, "public")));

// Configuración Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API y Views
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

module.exports = app;

