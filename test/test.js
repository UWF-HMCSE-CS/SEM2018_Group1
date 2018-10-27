let assert = require('assert');
let dbcon = require('../lib/mysqlDBMgr.js');


describe('mySQLDBMgr', function(){
	describe('query: select from *', function()
	{
		it('should select all data from user table without error', function(done)
		{
			dbcon.query('select * from user', function(err)
			{
				if (err) done(err);
				else done();
			});
		});
	});
});



describe('mySQLDBMgr', function(){
	describe('query: Insert int login', function()
	{
		it('should insert a fields into the database without error', function(done)
		{
			let username = 'TestUsername';
			let email = 'testEmail@testdomain.com';
			let password = 'testPassword';
			dbcon.query('insert into login values(?,AES_ENCRYPT(?,?));', [username, password, require('../credentials.js').loginKey], function(err)
			{
				if (err) done(err);
				else done();
			});
		});
	});
});
//this checks to make sure there are no values returned from the query since it is using an unencrypted password to check in the database. If there is a value returned, the password was not 
//encrypted when it was inserted
describe('mySQLDBMgr', function(){
	describe('query: select user from login', function()
	{
		it('should return no values since the password being checked isn\'t encrypted ', function(done)
		{
			dbcon.query('select * from login where username = ? and password = ?', ['TestUsername', 'testPassword'], function (err, rows, cols)
			{
				assert(rows.length < 1);
				console.log(rows);
				if (err)  done(err);
				else done();
			});
		});
	});
});
//still need to test the results of query
describe('mySQLDBMgr', function(){
	describe('query: select from login with encrypted password', function()
	{
		it('should select the user from login without error', function(done)
		{
			let username = 'TestUsername';
			let password = 'testPassword';
			//dbcon.query('insert into login values(?,AES_ENCRYPT(?,?));', [username, password, require('../credentials.js').loginKey], function(err)
			 dbcon.query('select * from login where username = ? and password = AES_Encrypt(?,?);', [username, password, require('../credentials.js').loginKey], function (err, rows, cols) 
			{
				//console.log(rows[0].username);
				assert.equal(rows[0].username,  'TestUsername');
				//assert.equals(rows.username,  'TestUsername');
				if (err) done(err);
				else done();
			});
		});
	});
});

//delete user, also serves to clean up from previous insertions
describe('mySQLDBMgr', function(){
	describe('query: delete user', function()
	{
		it('should delete from login withour error', function(done)
		{
			let username = 'TestUsername';
			 dbcon.query('delete from login where username = ?', [username], function (err, rows, cols)
			{
				if (err) done(err);
				else done();
			});
		});
	});
});