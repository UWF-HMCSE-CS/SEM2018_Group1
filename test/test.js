let assert = require('assert');
let dbcon = require('../lib/mysqlDBMgr.js');


describe('mySQLDBMgr', function(){
	describe('query: select * from user', function()
	{
		it('should select all data from user table without error', function(done)
		{
			console.log("##teamcity[testSuiteStarted name='login tests']");
			console.log('##teamcity[testStarted name=\'selecting all from user\']');
			dbcon.query('select * from user', function(err)
			{
				if (err) done(err);
				else done();
			});
		});
	});
});



describe('mySQLDBMgr', function(){
	describe('query: Insert into login', function()
	{
		it('should insert a fields into the database without error', function(done)
		{
			
			console.log('##teamcity[testStarted name=\'insert into login\']');
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
			console.log('##teamcity[testStarted name=\'select a user form login without encrypted password\']');
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
			console.log('##teamcity[testStarted name=\'selecting from login and checking encrypted password\']');
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

describe('mySQLDBMgr', function(){
	describe('query: Insert into user', function()
	{
		it('should insert a fields into the user table without error', function(done)
		{
			console.log('##teamcity[testStarted name=\'insert into user\']');
			let username = 'TestUsername';
			let email = 'testEmail@testdomain.com';
			dbcon.query('insert into user (username, email) values(?,?);', [username, email], function(err)
			{
				if (err) done(err);
				else done();
			});
		});
	});
});

describe('mySQLDBMgr', function(){
	describe('query: select user from user', function()
	{
		it('should return the user inserted in the table ', function(done)
		{
			console.log('##teamcity[testStarted name=\'select a user form user\']');
			let username = 'TestUsername';
			let email = 'testEmail@testdomain.com';
			dbcon.query('select * from user where username = ? and email = ?', [username, email], function (err, rows, cols)
			{
				console.log(rows);
				assert.equal(rows[0].username,  username);
				assert.equal(rows[0].email,  email);
				if (err)  done(err);
				else done();
			});
		});
	});
});

//delete user, also serves to clean up from previous insertions
describe('mySQLDBMgr', function(){
	describe('query: delete user from user', function()
	{
		it('should delete from user withour error', function(done)
		{
			console.log('##teamcity[testStarted name=\'deleting user from user\']');
			let username = 'TestUsername';
			 dbcon.query('delete from user where username = ?', [username], function (err, rows, cols)
			{
				if (err) done(err);
				else done();
			});
		});
	});
});
describe('mySQLDBMgr', function(){
	describe('query: delete user from login', function()
	{
		it('should delete from login withour error', function(done)
		{
			console.log('##teamcity[testStarted name=\'deleting user from login\']');
			console.log("##teamcity[testSuiteFinished name='login tests']");
			let username = 'TestUsername';
			 dbcon.query('delete from login where username = ?', [username], function (err, rows, cols)
			{
				if (err) done(err);
				else done();
			});
		});
	});
});