var mysql = require("mysql");

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Uncharted4.",
    database:"hms"
});

module.exports = con;
