var passport = require('passport');
var router = require('express').Router();
var request = require("request");

router.get('/login', function(req,res){
	res.render('login',{});
});
router.post('/login', function(req,res){
	console.log(req.body);
	if(req.body.login){
		console.log("LOGIN ROUTE");
		res.redirect('/');
	}
	else if (req.body.register){
		console.log("REGISTER ROUTE");
		res.redirect('/register');
	}
	else res.redirect('/');
});
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
/*router.get('/home.html',function(req,res){
	res.redirect('/');
})*/
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