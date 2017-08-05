"use strict";

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Users = require("./Users");

const dbport = 27017;

let database;

switch (process.env.MODE) {
    case "DEVELOPMENT":
        database = "makinbaconDev";
        break;
    case "TESTING":
        database = "makinbaconTest";
        break;
    case "PRODUCTION":
        database = "makinbacon";
        break;
    default:
        database = "makinbaconDev";
        break;
}

const connection = mongoose.connect(
    process.env.MONGODB_URI || `mongodb://localhost:${dbport}/${database}`,
    {
        useMongoClient: true
    }
);

module.exports = {
    Users,
    connection
};
