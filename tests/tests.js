let dbcon = require('../lib/mysqlDBMgr.js');
let assert = require('assert');

dbcon.query('select * from user;', function(err,rows,cols){
    assert(err,null);
});