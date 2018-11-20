var sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./blogDB.sqlite3');

module.exports = db;