let passport = require('passport');
let router = require('express').Router();
let request = require("request");
let dbcon = require(__dirname + '/lib/mysqlDBMgr.js');

router.get('/login', function(req,res){
	res.render('login',{
		
	});
});
router.post('/login', function(req,res){
	console.log(req.body);
	console.log(req.body.action);
	console.log(req.body.action);
	if(req.body.action == 'login'){
		console.log("LOGIN ROUTE");
		//req.body.username
		//req.body.password







		res.redirect('/');
	}
	else if (req.body.action == 'register'){
		console.log("REGISTER ROUTE");
		formUsername = req.body.username;
		formPassword = req.body.password;
		res.redirect('/join');
	}
	else res.redirect('/');
});

router.get('/join', function(req,res){
	res.render('signUp', {
		
	});
});
router.post('/join', function(req,res){
	console.log(req.body);
	console.log('Username: ' + req.body['user[login]']);
	let username = req.body['user[login]'];
	let email = req.body['user[email]'];
	let password = req.body['user[password]'];

	res.redirect('/login');
})
router.get('/league',function(req,res){
	res.render('league',{});
})
router.get('/players',function(req,res){
	res.render('players',{});
})
router.get('/team',function(req,res){
	res.render('team',{});
})

//until fixed
router.get('/home.html',function(req,res){
	res.redirect('/');
})
router.get('/players.html',function(req,res){
	res.redirect('/players');
})
router.get('/team.html',function(req,res){
	res.redirect('/team');
})
router.get('/login.html',function(req,res){
	res.redirect('/login');
})
router.get('/league.html',function(req,res){
	res.redirect('/league');
})

router.get('/',function(req,res){
	res.render('home',{});
})


module.exports = router