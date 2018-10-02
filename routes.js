var passport = require('passport');
var router = require('express').Router();
var request = require("request");

router.get('/login', function(req,res){
	res.render('login',{});
})

module.exports = router