let passport = require('passport');
let router = require('express').Router();
let request = require("request");
let dbcon = require(__dirname + '/lib/mysqlDBMgr.js');

router.get('/login', function(req,res){
	console.log(req.user);
	res.render('login',{
		user: req.user
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
		console.log(passport);
		console.log(passport._strategies.local._verify(req.body.username, req.body.password, function(item1,item2){

		}));
		let authFunction = function(err, user, info) {
			console.log(err);
			console.log(user);
			console.log(info);
        	if (err) { console.log(err);return next(err); }
        	if (!user) {
            	console.log("Sorry credentials don't match");
        	    //badCreds = 1;
        	    return res.redirect('/login');
        	} else {
            	req.login(user, function(err) {
            	    if (err) { return next(err); }
            	    //badCreds = 0;
            	    //currentUserID = user.id;
            	    return res.redirect('/');
            	});
        	}
    	}
    	authFunction(null,{
    		username: 'CES_the_reaper',
    		password: 'smasm1sn3ila'
    	})
		passport.authenticate('local', authFunction)
    	/*passport.authenticate('local',{
    		successRedirect: '/',
            failureRedirect: '/login'
        });*/
		//res.redirect('/');
	}
	else if (req.body.action == 'register'){
		console.log("REGISTER ROUTE");
		formUsername = req.body.username;
		formPassword = req.body.password;
		res.redirect('/join');
	}
	else res.redirect('/login');
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
	dbcon.query('insert into login values(?,AES_ENCRYPT(?,?));',[username, password, require(__dirname + '/credentials.js').loginKey],function(err,rows,cols){
		if(!err)
			res.redirect('/login');
		else{
			res.render('/join', {
				error: "Username is possibly already in use."
			});
		}
	});
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
	console.log(req.User);
	var user = {
		username: req.user.username
	}
	//console.log(req);
	res.render('home',{
		user: user
	});
})


module.exports = router