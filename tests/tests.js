let dbcon = require('../lib/mysqlDBMgr.js');
let assert = require('assert');

var numberOfErrors = 0;
var dbLocked = false;
let waitOnDB = function(callback, next){
    while (true){
        if(!dbLocked) return callback(next);
    }
};
let test1 = function(next){
    try {
        while(dbLocked);
        dbLocked = true;
        dbcon.query('select * from user;', function (err, rows, cols) {
            console.log("error is: " + err);
            if (err) throw err;
        });
    }catch(e){
        console.error(e);
        numberOfErrors ++;
    }finally{
        dbLocked = false;
        waitOnDB(next,test3);
    }
};
let test2 = function(next) {
    try {
        while (dbLocked) ;
        dbLocked = true;
        let username = "TestUsername";
        let email = "testEmail@testdomain.com";
        let password = "testPassword";
        dbcon.query('insert into login values(?,AES_ENCRYPT(?,?));', [username, password, require('../credentials.js').loginKey], function (err, rows, cols) {
            if (!err) {
                dbcon.query('insert into user values(?,?);', [username, email], function (err2, rows, cols) {
                    if (err2) {
                        console.error("User probably exists in user table already");
                        console.error(err2);
                        throw err2;
                    }
                });

            } else {
                console.error("User probably already exists in login");
                console.error(err);
                throw err;
            }
        });
    } catch (e) {
        console.error(e);
        numberOfErrors++;
    } finally {
        dbLocked = false;
        waitOnDB(next,test4);
    }
};
let test3 = function(next) {
    try {
        while (dbLocked) ;
        dbLocked = true;
        dbcon.query('select * from login where username = ? and password = ?', ['TestUsername', 'testPassword'], function (err, rows, cols) {
            if (err) throw err;
            if (rows[0]) {
                console.error("Password wasn't made secure.");
                numberOfErrors++;
            }
        });
    } catch (e) {
        console.error(e);
        numberOfErrors++;
    } finally {
        dbLocked = false;
        waitOnDB(next,test5);
    }
};
let test4 = function(next) {
    try {
        while (dbLocked) ;
        dbLocked = true;
        let username = "TestUsername";
        let password = "testPassword";
        dbcon.query('select * from login where username = ? and password = AES_Encrypt(?,?);', [username, password, require('../credentials.js').loginKey], function (err, rows, cols) {
            console.log(rows);
            if (!err && rows && rows[0]) {

            } else if (!err) {
                console.error('Login system fails at attempt to log in.');
                numberOfErrors++;
            }
            if (err) throw err;
        });
    } catch (e) {
        console.error(e);
        numberOfErrors++;
    } finally {
        dbLocked = false;
        waitOnDB(next,finale);
    }
};
let test5 = function() {
    try {
        while (dbLocked) ;
        dbLocked = true;
        dbcon.query('delete from login where username = ?', ['TestUsername'], function (err, rows, cols) {
            if (err) {
                console.error('failure to delete testuser from login -- check if testuser was created in above statement');
                throw err;
            }
            dbcon.query('delete from user where username = ?', ['TestUsername'], function (err, rows, cols) {
                if (err) {
                    console.err('failure to delete testuser from user -- check if testuser was created in above statement');
                }
            })
        })
    } catch (e) {
        console.error(e);
        numberOfErrors++;
    } finally {
        dbLocked = false;
    }
};

try{
    while(dbLocked);
    dbLocked = true;

}catch(e){
    console.error(e);
    numberOfErrors++;
}finally{
    dbLocked = false;
}
let finale = function() {
    assert(numberOfErrors === 0, "You have " + numberOfErrors + " happening in this application's test script, please fix them before moving these to release!");
};
waitOnDB(test1,test2);