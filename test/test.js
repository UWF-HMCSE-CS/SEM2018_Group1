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

describe('mySQLDBMgr', function(){
	describe('query: Insert into team', function()
	{
		it('should insert a fields into the team table without error', function(done)
		{
			console.log('##teamcity[testStarted name=\'insert into team\']');
			let teamID = 999;
			let leagueID = 9999;
			let username = 'TestUsername';
			let teamName = 'TestTeamName';
			dbcon.query('insert into team (teamID, leagueID, username, teamName) values (?,?,?,?);', [teamID, leagueID, username, teamName], function(err)
			{
				if (err) done(err);
				else done();
			});
		});
	});
});

describe('mySQLDBMgr', function(){
	describe('query: select team from team', function()
	{
		it('should return the team inserted in the table ', function(done)
		{
			console.log('##teamcity[testStarted name=\'select a team form team\']');
			let teamID = 999;
			let leagueID = 9999;
			let username = 'TestUsername';
			let teamName = 'TestTeamName';
			dbcon.query('select * from team where teamID = ?', [teamID], function (err, rows, cols)
			{
				console.log(rows);
				assert.equal(rows[0].teamID,  teamID);
				assert.equal(rows[0].leagueID,  leagueID);
				assert.equal(rows[0].username,  username);
				assert.equal(rows[0].teamName,  teamName);
				if (err)  done(err);
				else done();
			});
		});
	});
});

describe('mySQLDBMgr', function(){
	describe('query: Insert into player', function()
	{
		it('should insert a fields into the player table without error', function(done)
		{
			console.log('##teamcity[testStarted name=\'insert into player\']');
			let playerID = 99;
			let playername = 'TestPlayerName';
			dbcon.query('insert into player (playerID, playername) values (?,?);', [playerID, playername], function(err)
			{
				if (err) done(err);
				else done();
			});
		});
	});
});

describe('mySQLDBMgr', function(){
	describe('query: select player from player', function()
	{
		it('should return the player inserted in the table ', function(done)
		{
			console.log('##teamcity[testStarted name=\'select a player form player\']');
			let playerID = 99;
			let playername = 'TestPlayerName';
			dbcon.query('select * from player where playerID = ?', [playerID], function (err, rows, cols)
			{
				console.log(rows);
				assert.equal(rows[0].playerID,  playerID);
				assert.equal(rows[0].playername,  playername);
				if (err)  done(err);
				else done();
			});
		});
	});
});

describe('mySQLDBMgr', function(){
	describe('query: Insert into player_team', function()
	{
		it('should insert a fields into the player_team table without error', function(done)
		{
			console.log('##teamcity[testStarted name=\'insert into player_team\']');
			let teamID = 999;
			let playerID = 99;
			dbcon.query('insert into player_team (teamID, playerID) values (?,?);', [teamID, playerID], function(err)
			{
				if (err) done(err);
				else done();
			});
		});
	});
});

describe('mySQLDBMgr', function(){
	describe('query: select player_team from player_team', function()
	{
		it('should return the player_team inserted in the table ', function(done)
		{
			console.log('##teamcity[testStarted name=\'select a player_team form player_team\']');
			let teamID = 999;
			let playerID = 99;
			dbcon.query('select * from player_team where teamID = ? and playerID = ?', [teamID, playerID], function (err, rows, cols)
			{
				console.log(rows);
				assert.equal(rows[0].teamID,  teamID);
				assert.equal(rows[0].playerID,  playerID);
				if (err)  done(err);
				else done();
			});
		});
	});
});

//delete user, also serves to clean up from previous insertions
describe('mySQLDBMgr', function(){
	describe('query: delete player_team', function()
	{
		it('should delete from player_team withour error', function(done)
		{
			console.log('##teamcity[testStarted name=\'deleting player_team from player_team\']');
			let teamID = 999;
			let playerID = 99;
			 dbcon.query('delete from player_team where teamID = ? and playerID = ?', [teamID, playerID], function (err, rows, cols)
			{
				if (err) done(err);
				else done();
			});
		});
	});
});
describe('mySQLDBMgr', function(){
	describe('query: delete player', function()
	{
		it('should delete from player withour error', function(done)
		{
			console.log('##teamcity[testStarted name=\'deleting player from player\']');
			let playerID = 99;
			let playername = 'TestPlayerName';
			 dbcon.query('delete from player where playerID = ?', [playerID], function (err, rows, cols)
			{
				if (err) done(err);
				else done();
			});
		});
	});
});
describe('mySQLDBMgr', function(){
	describe('query: delete team', function()
	{
		it('should delete from team withour error', function(done)
		{
			console.log('##teamcity[testStarted name=\'deleting team from team\']');
			let teamID = 999;
			let leagueID = 9999;
			let username = 'TestUsername';
			let teamName = 'TestTeamName';
			 dbcon.query('delete from team where teamID = ?', [teamID], function (err, rows, cols)
			{
				if (err) done(err);
				else done();
			});
		});
	});
});
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

/* DRAFT TESTING */
let mockUser = { username: 'user1' };

let mockPlayers = [];
for(let i =0 ; i < 4 ; i++) {
	mockPlayers.push({ playerID: i, playername: 'player' + i });
}

let mockLeague = { 
	leagueID: 999, 
	leagueOwner: mockUser.username, 
	leagueName: 'name', 
	players_per_team: 2 
};

let mockTeams = [];
mockTeams.push({
	teamID : 1,
	leagueID: mockLeague.leagueID,
	username: mockUser.username,
	teamName: 'team1'
});
mockTeams.push({
	teamID : 2,
	leagueID: mockLeague.leagueID,
	username: 'user2',
	teamName: 'team2'
});

let mockDraft = {
	allPlayers: mockPlayers,
	leagueSettings: mockLeague,
	teams: mockTeams,
	allPicks: [] // to be tested
};

let helpers = require('../draft/draftHelpers.js');
describe('draft', function(){
	let teams = mockDraft.teams;
	let rounds = mockDraft.leagueSettings.players_per_team;
	describe('helpers: shuffle', function()
	{
		let testTeams = helpers.shuffle(teams);

		it('returns a list of the same length', function(done)
		{
			assert.equal(teams.length , testTeams.length);
			done();
		});
	});

	describe('helpers: generateSnakeDraftOrder', function()
	{
		mockDraft.allPicks = helpers.generateSnakeDraftOrder(teams, rounds);

		it('total picks = rounds * number of teams', function(done)
		{
			assert.equal(mockDraft.allPicks.length , (rounds * teams.length) );
			done();
		});
		it('has a snaked order', function(done)
		{
			// 1 2 2 1 (using 2 teams)
			assert.equal(mockDraft.allPicks[0].team , mockDraft.allPicks[3].team);
			assert.equal(mockDraft.allPicks[1].team , mockDraft.allPicks[2].team);
			done();
		});
	});
	
	describe('helpers: usersTeam', function()
	{
		let mockUsersTeam = teams.find(function(team) {
			return team.username === mockUser.username;
		});
		let testTeam = helpers.usersTeam(mockUser.username, mockDraft);

		it('returns the users team settings', function(done)
		{
			assert.equal(mockUsersTeam.teamID, testTeam.teamID);
			assert.equal(mockUsersTeam.username, testTeam.username);
			assert.equal(mockUsersTeam.teamName, testTeam.teamName);
			done();
		});
		it('returns the picks that belong to the user', function(done)
		{
			for(let i = 0 ; i < testTeam.picks.length ; i++ ) {
				assert.equal(mockUser.username, testTeam.picks[i].team.username);
			}
			done();
		});
	});
	
	describe('helpers: getCurrentPick', function()
	{
		let testPick = helpers.getCurrentPick(mockDraft);

		it('returns the first pick before any picks are made', function(done)
		{
			assert.equal(mockDraft.allPicks[0], testPick);
			done();
		});

		it('returns the next pick after picks are made', function(done)
		{
			for(let i = 0 ; i < mockDraft.allPicks.length ; i++) {
				mockDraft.allPicks[i].player = mockDraft.allPlayers[i];
				testPick = helpers.getCurrentPick(mockDraft);
	
				assert.equal(mockDraft.allPicks[i+1], testPick);
			}
			done();
		});

		it('returns null on the last pick', function(done)
		{
			for(let i = 0 ; i < mockDraft.allPicks.length ; i++) {
				mockDraft.allPicks[i].player = mockDraft.allPlayers[i];
				testPick = helpers.getCurrentPick(mockDraft);
	
				if(i == mockDraft.allPicks.length) assert.ok(!testPick);
			}
			done();
		});
	});
	
	describe('helpers: getAvailablePlayers', function()
	{
		let testPlayers = helpers.getAvailablePlayers(mockDraft);

		it('returns allPlayers before any picks are made', function(done)
		{
			for(let i = 0 ; i < mockDraft.allPlayers.length ; i ++) {
				assert.equal(mockDraft.allPlayers[i], testPlayers[i]);
			}
			done();
		});

		it('returns only available players after picks are made', function(done)
		{
			for(let i = 0 ; i < mockDraft.allPicks.length ; i++) {
				mockDraft.allPicks[i].player = null;
			}
			for(let i = 0 ; i < mockDraft.allPicks.length ; i++) {
				mockDraft.allPicks[i].player = mockDraft.allPlayers[i];
				testPlayers = helpers.getAvailablePlayers(mockDraft);
	
				for(let j = i; j < mockDraft.allPlayers.length ; j++) {
					assert.equal(mockDraft.allPlayers[j+1], testPlayers[j-i]);
				}
			}
			done();
		});
	});
});