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



describe('mySQLDBMgr', function(){
	describe('query: Insert into league', function()
	{
		it('should insert a fields into the league table without error', function(done)
		{
			console.log('##teamcity[testStarted name=\'insert into league\']');
			let leagueID = 9999;
			let ownerID = 'TestUsername';
			let leagueName = 'TestLeagueName';
			let players_per_team = 2;
			dbcon.query('insert into league (leagueID, ownerID, leagueName, players_per_team) values (?,?,?,?);', [leagueID, ownerID, leagueName, players_per_team], function(err)
			{
				if (err) done(err);
				else done();
			});
		});
	});
});

describe('mySQLDBMgr', function(){
	describe('query: select league from league', function()
	{
		it('should return the league inserted in the table ', function(done)
		{
			console.log('##teamcity[testStarted name=\'select a league form league\']');
			let leagueID = 9999;
			let ownerID = 'TestUsername';
			let leagueName = 'TestLeagueName';
			let players_per_team = 2;
			dbcon.query('select * from league where leagueID = ?', [leagueID], function (err, rows, cols)
			{
				console.log(rows);
				assert.equal(rows[0].leagueID,  leagueID);
				assert.equal(rows[0].ownerID,  ownerID);
				assert.equal(rows[0].leagueName,  leagueName);
				assert.equal(rows[0].players_per_team,  players_per_team);
				if (err)  done(err);
				else done();
			});
		});
	});
});




describe('mySQLDBMgr', function(){
	describe('query: Insert into invite', function()
	{
		it('should insert a fields into the invite table without error', function(done)
		{
			console.log('##teamcity[testStarted name=\'insert into invite\']');
			let leagueID = 9999;
			let username = 'TestUsername';
			dbcon.query('insert into invite (leagueID, username) values (?,?);', [leagueID, username], function(err)
			{
				if (err) done(err);
				else done();
			});
		});
	});
});

describe('mySQLDBMgr', function(){
	describe('query: select invite from invite', function()
	{
		it('should return the invite inserted in the table ', function(done)
		{
			console.log('##teamcity[testStarted name=\'select an invite form invite\']');
			let leagueID = 9999;
			let username = 'TestUsername';
			dbcon.query('select * from invite where leagueID = ? and username = ?', [leagueID, username], function (err, rows, cols)
			{
				console.log(rows);
				assert.equal(rows[0].leagueID,  leagueID);
				assert.equal(rows[0].username,  username);
				if (err)  done(err);
				else done();
			});
		});
	});
});

//delete user, also serves to clean up from previous insertions
describe('mySQLDBMgr', function(){
	describe('query: delete invite', function()
	{
		it('should delete from invite withour error', function(done)
		{
			console.log('##teamcity[testStarted name=\'deleting invite from invite\']');
			let leagueID = 9999;
			let username = 'TestUsername';
			 dbcon.query('delete from invite where leagueID = ? and username = ?', [leagueID, username], function (err, rows, cols)
			{
				if (err) done(err);
				else done();
			});
		});
	});
});
describe('mySQLDBMgr', function(){
	describe('query: delete league', function()
	{
		it('should delete from league withour error', function(done)
		{
			console.log('##teamcity[testStarted name=\'deleting league from league\']');
			let leagueID = 9999;
			 dbcon.query('delete from league where leagueID = ?', [leagueID], function (err, rows, cols)
			{
				if (err) done(err);
				else done();
			});
		});
	});
});
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