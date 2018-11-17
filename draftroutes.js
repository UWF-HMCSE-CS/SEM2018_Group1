let passport = require('passport');
let router = require('express').Router();
let request = require("request");
let dbcon = require(__dirname + '/lib/mysqlDBMgr.js');

router.post('/league/addplayer',function(req,res,next){
	if(
		req.user.username
		&& req.body.leagueID
		&& req.body.playerName
	){

		console.log('insert into [databasetablenamehere](leagueID,playerName) values (?,?);\n[\n' + req.body.leagueID + ',\n' + req.body.playerName + '\n]');
	}
});

let updatePlayerFunction_RECURSIVE = function(remaining,original,playerContent){
	if(remaining > 0) console.log("[" + (original-remaining) + "] Player ID: " + playerContent[(original-remaining)].id + " Player Name: " + playerContent[(original-remaining)].name );
	if(remaining > 0) dbcon.query('insert into player values (?,?) on duplicate key update playername=?;',[playerContent[(original-remaining)].id,playerContent[(original-remaining)].name,playerContent[(original-remaining)].name],function(err,rows,cols){
		if(remaining > 0) if(!err) updatePlayerFunction_RECURSIVE(remaining-1,original,playerContent);
	});
}
router.post('/syncplayers',function(req,res,next){
	/*const options = {
  		hostname: 'api.overwatchleague.com',
  		port: 443,
  		path: '/players',*?
  		method: 'POST'/*,
  		headers: {
    		'Content-Type': 'application/x-www-form-urlencoded',
    		'Content-Length': Buffer.byteLength(postData)
  		}*//*
	};*/
	/*request(options, (response) => {
		console.log('status: ' + response.status);
		console.log('headers: ' + JSON.stringify(response.headers))
		response.on('data', (chunk) => {
			console.log('body: ' + JSON.stringify(chunk))
		})
		response.on('end', () => {
    		console.log('No more data in response.');
    		res.json({
    			status: 'finished'
    		});
  		});
	})*/
	request('https://api.overwatchleague.com/players',function(error,response,body){
		console.log("status code returned: " + response.statusCode);
		console.log("body: " + body);
		let players = JSON.parse(body);
		let playerList = [];
		/*for(var i = 0; i < Object.keys(players["content"]).length; i++){
			playerList[i] = {
				id: players["" + Object.keys(players)[i]].id,
			}
		}*/
		console.log(Object.keys(players["content"]));
		updatePlayerFunction_RECURSIVE(players["content"].length,players["content"].length,players["content"]);
		res.json(players["content"]);
	});
});

module.exports = router;