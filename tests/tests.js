let dbcon = require('../lib/mysqlDBMgr.js');
let assert = require('assert');

var numberOfErrors = 0;
try {
    dbcon.query('select * from user;', function (err, rows, cols) {
        console.log("error is: " + err);
        if (err) throw err;
    });
}catch(e){
    console.error(e);
    numberOfErrors ++;
}
try{
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

        }else {
            console.error("User probably already exists in login");
            console.error(err);
            throw err;
        }
    });
}catch(e){
    console.error(e);
    numberOfErrors++;
}try{
    dbcon.query('select * from login where username = ? and password = ?', ['TestUsername','testPassword'], function(err, rows, cols){
        if(err) throw err;
        if(rows[0]) {
            console.error("Password wasn't made secure.");
            numberOfErrors++;
        }
    });
}catch(e){
    console.error(e);
    numberOfErrors++;
}try{
    let username = "TestUsername";
    let password = "testPassword";
    dbcon.query('select * from login where username = ? and password = AES_Encrypt(?,?);',[username,password,require('../credentials.js').loginKey], function(err,rows,cols){
        console.log(rows);
        if(!err && rows && rows[0]){

        }else if(!err){
            console.error('Login system fails at attempt to log in.');
            numberOfErrors++;
        }
        if(err) throw err;
    });
}catch(e){
    console.error(e);
    numberOfErrors++;
}try{
    dbcon.query('delete from login where username = ?', ['TestUsername'], function(err,rows,cols){
        if(err){
            console.error('failure to delete testuser from login -- check if testuser was created in above statement');
            throw err;
        }
        dbcon.query('delete from user where username = ?', ['TestUsername'], function(err,rows,cols){
            if(err){
                console.err('failure to delete testuser from user -- check if testuser was created in above statement');
            }
        })
    })
}catch(e){
    console.error(e);
    numberOfErrors++;
}try{

}catch(e){
    console.error(e);
    numberOfErrors++;
}
assert(numberOfErrors===0,"You have " + numberOfErrors + " happening in this application's test script, please fix them before moving these to release!");