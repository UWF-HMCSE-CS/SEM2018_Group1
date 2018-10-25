var cred = require('../credentials.js');
var mysql = require('mysql');
var DB = mysql.db;
var BaseRow = mysql.row;
var BaseColumn = mysql.column;
var connection = mysql.createConnection({
    host: cred.dbCreds.host,
    user: cred.dbCreds.user,
    password: cred.dbCreds.pass,
    database: cred.dbCreds.database
});

module.exports = {
    connect: function () {
        connection.connect(function (err) {
            if (!err) {
                console.log("Database is connected ... ");
                return true;
            }
            else {
                console.error("Error connecting to the database :( ... ");
                console.error(err);
                return false;
            }
        });
    },
    basicQuery: function (q, callback) {
        //console.log(q);
        connection.query(q, function (err, rows, fields) {
            if (!err) {
                //console.log("Successful");
                //console.log("rows: " + rows.length);
            }
            else {
                console.error(err);
            }
            return callback(err, rows, fields);
        });
    },
    disconnect: function () {
        //console.log("Database Server should be disconnected.");
        connection.end();
    },
    session: connection,
    query: function (q, callback) {
        var z = q;
        console.log(z);
        var connection = mysql.createConnection({
            host: cred.dbCreds.host,
            user: cred.dbCreds.user,
            password: cred.dbCreds.pass,
            database: cred.dbCreds.database
        });
        connection.query(z, function (error, rows, fields) {
            if (!error) {
                return callback(error, rows, fields);
            }
            else {
                console.error(error);
                return callback(error,null,null);
            }
            return callback(error, rows, fields);
        });
        connection.end();
    },
    query: function (q, p, callback) {
        var z = q;
        var y = p;
        console.log(z);
        console.log(y);
        var connection = mysql.createConnection({
            host: cred.dbCreds.host,
            user: cred.dbCreds.user,
            password: cred.dbCreds.pass,
            database: cred.dbCreds.database
        });
        connection.query(z, y, function (error, rows, fields) {
            if (!error) {
                return callback(error, rows, fields);
            }
            else {
                console.error(error);
                return callback(error,null,null);
            }
            return callback(error, rows, fields);
        });
        connection.end();
    }
}
