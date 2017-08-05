"use strict";

/**
 * Imports
 *
 */
/** Node */
const fs = require("fs");
const https = require("https");
/** Express */
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
/** Database */
const { connection } = require("./models");
/** Authentication */
const passport = require("./auth");

/**
 * Database settings
 *
 */
connection.then(database => {
    database.once("open", () => {
        console.log(`Mongo connected!`);
    });
    database.on("error", err => console.error(`connection error: ${err}`));
});

/**
 * Server settings
 *
 */
const app = express();
const port = process.env.PORT || 3000;

/**
 * Global Middleware
 *
 */
/** Logging */
app.use(morgan("dev"));
/** CORS */
app.use(cors());
/** Session Store */
app.use(
    session({
        secret: "protoshield",
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({
            dbPromise: connection
        })
    })
);
/** Authentication */
app.use(passport.initialize());
/** Body Parser */
app.use("/api", bodyParser.text({ type: "text/graphql" }));

/** 
 * Routes
 *
 */
/** Authentication */
app.get("/auth", passport.authenticate("google", { scope: ["profile"] }));
/** Authentication Callback */
app.get(
    "/auth/callback",
    passport.authenticate("google", { failureRedirect: "/auth" }),
    (req, res, next) => {
        return res.redirect("/api");
    }
);
/** GraphQL API Endpoint */
app.get("/api", (req, res, next) => {
    return res.send(`<h1>${JSON.stringify(req.session)}</h1>`);
});

/**
 * Global errors
 *
 */
/** 404 */
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    return next(err);
});
/** handler */
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 400);
    return res.json(err);
});

/**
 * Server instantitation
 *
 */
https
    .createServer(
        {
            key: fs.readFileSync("key.pem"),
            cert: fs.readFileSync("cert.pem"),
            passphrase: "protoshield"
        },
        app
    )
    .listen(port);

module.exports = app;

// app.get("/", function(req, res) {
//     res.header("Content-type", "text/html");
//     return res.end("<h1>Hello, Secure World!</h1>");
// });
