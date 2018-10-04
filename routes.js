var passport = require('passport');
var router = require('express').Router();
var request = require("request");

router.get('/login', function(req,res){
	res.render('login',{});
});
router.post('/login', function(req,res){
	console.log(req.body);
	if(req.body.login)
		res.redirect('/');
	else if (req.body.register)
		res.redirect('/register');
});

module.exports = router