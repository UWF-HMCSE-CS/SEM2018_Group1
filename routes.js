let passport = require('passport');
let router = require('express').Router();
let request = require("request");
let dbcon = require(__dirname + '/lib/mysqlDBMgr.js');


router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
router.get('/login', function (req, res) {
    console.log(req.user);
    if (req.user) res.redirect('/');
    else
        res.render('login', {
            layout: false,
            username: (req.user && req.user.username) ? req.user.username : null
        });
});
router.post('/login', function (req, res) {
    console.log(req.body);
    console.log(req.body.action);

    var successRoute = '/';
    if (req.body.action.startsWith('login')) {
        if (req.body.action != 'login') successRoute = '/' + req.body.action.substr(6)
    }
    if (req.body.action.startsWith('login')) {
        console.log("LOGIN ROUTE");
        //req.body.username
        //req.body.password
        console.log(passport);
        console.log(passport._strategies.local._verify(req.body.username, req.body.password, function (item1, item2) {

        }));
        let test = function (username, password, done) {
            var loggedInUser;
            console.log("inside passport strat");
            dbcon.query('select * from login where username = ? and password = AES_Encrypt(?,?);',[username,password,require(__dirname + '/credentials.js').loginKey], function(err,rows,cols){
                console.log('login?: ' + rows);
                if(!err && rows && rows[0]){
                    console.log("Success?");
                    return done(null, rows[0]);
                }else {
                    console.log("Failure");

                    return done(null, false, {message: "Failed to login (Bad Credentials?)"});
                }
            });
        };
        let authFunction = function (err, user, info) {
            console.log('error');
            console.log(err);
            console.log('user');
            console.log(user);
            console.log('info');
            console.log(info);
            if (err) {
                console.log(err);
                return err;
            }
            console.log('user' + user);
            console.log(user);
            if (!user) {
                console.log("Sorry credentials don't match");
                //badCreds = 1;
                return res.redirect('/login');
            } else {
                let test = function (username, password, done) {
                    var loggedInUser;
                    console.log("inside passport strat");
                    dbcon.query('select * from login where username = ? and password = AES_Encrypt(?,?);',[username,password,require(__dirname + '/credentials.js').loginKey], function(err,rows,cols){
                        console.log('login?: ' + rows);
                        if(!err && rows && rows[0]){
                            console.log("Success?");
                            return done(null, rows[0]);
                        }else {
                            console.log("Failure");

                            return done(null, false, {message: "Failed to login (Bad Credentials?)"});
                        }
                    });
                };
                test(user.username, user.password, function(test1,test2,test3){
                    if(test2 && !test3){
                        req.login(user, function (err) {
                            if (err) {
                                return err;//next(err);
                            }
                            console.log('logintest2: ');
                            console.log(user);
                            //badCreds = 0;
                            //currentUserID = user.id;
                            return res.redirect(successRoute);
                        });
                    }
                    else return res.redirect('/login');
                })
            }
        };
        authFunction(null, {
            username: req.body.username,
            password: req.body.password
        });
        passport.authenticate('local', authFunction)
        /*passport.authenticate('local',{
            successRedirect: '/',
            failureRedirect: '/login'
        });*/
        //res.redirect('/');
    }
    else if (req.body.action == 'register') {
        console.log("REGISTER ROUTE");
        /*let formUsername = req.body.username;
        let formPassword = req.body.password;*/
        res.redirect('/join');
    }
    else res.redirect('/login');
});
router.get('/login/:next', function (req, res) {
    console.log(req.user);
    res.render('login', {
        username: (req.user && req.user.username) ? req.user.username : null,
        next: req.params.next
    });
});

router.get('/join', function (req, res) {
    if (req.user) res.redirect('/');
    else
        res.render('signUp', {layout:false});
});
router.post('/join', function (req, res) {
    console.log(req.body);
    console.log('Username: ' + req.body['user[login]']);
    let username = req.body['user[login]'];
    let email = req.body['user[email]'];
    let password = req.body['user[password]'];
    dbcon.query('insert into login values(?,AES_ENCRYPT(?,?));', [username, password, require(__dirname + '/credentials.js').loginKey], function (err, rows, cols) {
        if (!err) {
            dbcon.query('insert into user values(?,?);', [username, email], function (err2, rows, cols) {
                if (err2) {
                    next(err2);
                }
            });
            res.redirect('/login');
        }else {
            res.render('signUp', {
                error: "Username is possibly already in use."
            });
        }
    });
});

// If trying to access any page other than join or log in
// while not logged in, redirect to login page
router.use(function(req, res, next) {
	if (!req.user) {
		res.redirect('/login');
		return;
	}
	next();
});

router.get('/set/email/:emailaddress',function(req,res){
    if(req.user) {
        dbcon.query('insert into user values(?,?) on duplicate key update email = ?;', [req.user.username, req.params.emailaddress, req.params.emailaddress], function (err2, rows, cols) {
            if (err2) {
                next(err2);
            }
        });
    }else {
        next({
            message: "User not logged in, route inaccessible"
        });
    }
    res.redirect('/');
});
router.get('/league', function (req, res) {
    let user = {
        username: (req.user && req.user.username) ? req.user.username : null
    };
    //console.log(req);
    res.render('league', {
        username: user.username
    });
});
router.get('/league/add', function(req,res){
    res.redirect('/league');
});
router.get('/players', function (req, res) {
    let user = {
        username: (req.user && req.user.username) ? req.user.username : null
    };
    //console.log(req);
    res.render('players', {
        username: user.username
    });
});
router.get('/team', function (req, res) {
    let user = {
        username: (req.user && req.user.username) ? req.user.username : null
    };
    //console.log(req);
    res.render('team', {
        username: user.username
    });
});

router.get('/createleague', function (req, res) {
    let nums1to20 = [];
    for(let x = 1; x <= 20; x++) {
        nums1to20.push(x);
    }
    res.render('createleague', {nums1to20, username: req.user.username});
});

router.post('/createleague', function (req, res) {
    //create new league using leagueName, playersPerTeam, current user as league owner
    //and create new team for current user with newTeamName
    if (req.user && req.body.leagueName) {
        // get the auto-generated leagueID, so it can be used when adding new team
        dbcon.query("SELECT AUTO_INCREMENT FROM information_schema.tables WHERE table_name = 'league' AND table_schema = DATABASE( ) ;", function (err, rows, cols) {
            if (!err) {
                let leagueID = rows[0].AUTO_INCREMENT;
                dbcon.query("insert into league (ownerID, leagueName, players_per_team) values(?,?,?);", [req.user.username, req.body.leagueName, req.body.playersPerTeam], function (err2, rows, cols) {
                    if (!err2) {
                        dbcon.query("insert into team (leagueID, username, teamName) values (?,?,?);", [leagueID, req.user.username, req.body.newTeamName], function (err3, rows, cols) {
                            if (err3) {
                                next(err3);
                            }
                        });
                    }
                    else {
                        next(err2);
                    }
                });
            }
            else {
                next(err);
            }
        });
    }

    res.redirect('/');
});

//until fixed
router.get('/home.html', function (req, res) {
    res.redirect('/');
});
router.get('/players.html', function (req, res) {
    res.redirect('/players');
});
router.get('/team.html', function (req, res) {
    res.redirect('/team');
});
router.get('/login.handlebars', function (req, res) {
    res.redirect('/login');
});
router.get('/league.html', function (req, res) {
    res.redirect('/league');
});

router.get('/', function (req, res) {
    console.log(req.User);
    let user = {
        username: (req.user && req.user.username) ? req.user.username : null
    };
    //console.log(req);
    res.render('home', {
        username: user.username
    });
});


module.exports = router;