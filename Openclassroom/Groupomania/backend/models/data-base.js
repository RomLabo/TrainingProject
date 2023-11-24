const mysql = require('mysql2');

const database = mysql.createConnection({
    host: "localhost",
    user: process.env.USER_DATABASE,
    password: process.env.PWD_DATABASE,
    database: "groupomania"
});

module.exports = database;