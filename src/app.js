import __dirname from "./utils.js";
import path from "path";
import express from "express";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { iniciarPassport } from "./config/passport.config.js";
import dotoenv from "dotenv";
dotoenv.config();


const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB,
        ttl: 3600,
    })
}));

//passport
iniciarPassport();
app.use(passport.initialize());
app.use(passport.session());

export default app;