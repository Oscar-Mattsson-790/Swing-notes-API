const nedb = require("nedb-promises");
const database = new nedb({ filename: "notes.db", autload: true });
const uuid = require("uuid-random");
