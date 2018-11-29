let passport = require('passport');
let router = require('express').Router();
let request = require("request");
let dbcon = require(__dirname + '/lib/mysqlDBMgr.js');

router.get('*', function(req,res,next){
	if (!req.user) {
		return res.redirect('/login');
	}else next();
})
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
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
/*router.use(function(req, res, next) {
	if (!req.user) {
		res.redirect('/login');
		return;
	}
	next();
});*/

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

router.get('/league/:id', function(req,res){
    let user = {
        username: (req.user && req.user.username) ? req.user.username : null
    };

    
    let league = { id: req.params.id };

    dbcon.query('select leagueName from league where leagueID=?;', [league.id], function (err, rows, cols) {
        if (err) {
            next(err);
        }
        else {
            if (rows[0]) {
                league.name = rows[0].leagueName;
            }
            dbcon.query('select teamID, username, teamName from team where leagueID=?;', [req.params.id], function (err2, rows, cols) {
                if (err2) {
                    next(err2);
                }
                else {
                    let teamsInLeague = [];
                    for(let i = 0; i < rows.length; i++) {
                        teamsInLeague.push({
                            teamID: rows[i].teamID,
                            username: rows[i].username,
                            teamName: rows[i].teamName
                        });
                    }
                    league.teams = teamsInLeague;
                    res.render('league_detail', {
                        username: user.username,
                        league: league
                    });
                }
            });
        }
    });
});

router.get('/invite/:leagueID', function (req, res) {
    let user = {
        username: (req.user && req.user.username) ? req.user.username : null
    };

    let league = { id: req.params.leagueID };

    if(req.query && req.query.error && req.query.invitedUser) {
        res.render('invite', {
            error: true, 
            username: user.username,
            league: league,
            invitedUser: req.query.invitedUser
        });
    }
    else {
        res.render('invite', {
            username: user.username,
            league: league
        });
    }
});

router.post('/sendinvite', function (req, res) {
    console.log('**************INVITE INFO*****************');
    console.log(req.body);
    console.log('**************INVITE INFO*****************');
    if(req.user && req.body.invitedUser && req.body.leagueID) {
        let league = { id: req.body.leagueID };
        dbcon.query(`INSERT INTO invite (leagueID, username) VALUES(?,?);`, [req.body.leagueID, req.body.invitedUser], function (err, rows, cols) {
            if (!err) {
                res.redirect(303, '/league/' + league.id);
            }
            else {
                res.redirect(303, '/invite/' + league.id + '?error=1&invitedUser=' + req.body.invitedUser);
                //res.render('invite', {error: true, invitedUser: req.body.invitedUser, league: league});
                //next(err);
            }
        });
    }
});

router.get('/createTeam/:leagueID', function (req, res) {
    let user = {
        username: (req.user && req.user.username) ? req.user.username : null
    };

    let league = { id: req.params.leagueID };
    
    if(req.query && req.query.error && req.query.newTeamName) {
        res.render('createTeam', {
            error: true, 
            username: user.username,
            league: league,
            newTeamName: req.query.newTeamName
        });
    }
    else {
        res.render('createTeam', {
            username: user.username,
            league: league
        });
    }
});

router.post('/createTeam/:leagueID', function (req, res) {
    if(req.user && req.body.newTeamName && req.body.leagueID) {
        let league = { id: req.body.leagueID };
        dbcon.query(`INSERT INTO team (leagueID, username, teamName) VALUES(?,?,?);`, [league.id, req.user.username, req.body.newTeamName], function (err, rows, cols) {
            if (!err) {
                dbcon.query(`DELETE FROM invite 
                WHERE leagueID = ? 
                AND username = ?;`, [league.id, req.user.username], function (err, rows, cols) {
                    if(!err) {
                        res.redirect(303, '/league/' + league.id);
                    }
                    else {
                        res.redirect(303, '/createTeam/' + league.id + '?error=1&newTeamName=' + req.body.newTeamName);
                    }
                });
            }
            else {
                res.redirect(303, '/createTeam/' + league.id + '?error=1&newTeamName=' + req.body.newTeamName);
            }
        });
    }
});

// view all players that are "free agents" - not owned by any team in the league
router.get('/players/:leagueID', function (req, res) {
    let user = {
        username: (req.user && req.user.username) ? req.user.username : null
    };
    //console.log(req);

    let league = { id: req.params.leagueID };

    let players = [];
    dbcon.query(`SELECT *
    FROM player
    WHERE NOT EXISTS
        (SELECT * 
        FROM player_team
        WHERE player.playerID = player_team.playerID
        AND EXISTS 
            (SELECT *
            FROM team
            WHERE leagueID = ?
            AND team.teamID = player_team.teamID)) ORDER BY playername;`, 
            [league.id], function (err, rows, cols) {
        if(err) {
            //console.log('error loading players');
            res.render('players', {
                username: user.username,
                league: league,
                players: players
            });
        }
        else {
            //console.log('getting players...');
            for (let i = 0; i < rows.length; i++) {
                players.push({
                    playerID: rows[i].playerID,
                    playername: rows[i].playername
                });
            }
            //console.log(players);

            res.render('players', {
                username: user.username,
                league: league,
                players: players
            });
        }           
    });
});

// show screen confirming that user can, and wants to, add selected player to their team
// should prompt user to drop a player if team is full
router.get('/addplayer/:leagueID/:playerID', function (req, res) {
    let user = {
        username: (req.user && req.user.username) ? req.user.username : null
    };
    let league = { id: req.params.leagueID };
    let player = { id: req.params.playerID };

    dbcon.query(`SELECT IF((SELECT COUNT(playerID) FROM player_team WHERE teamID = (SELECT teamID FROM team WHERE username = ? AND leagueID = ?)) < 
    (SELECT players_per_team FROM league WHERE leagueID = ?),'roster spot available','roster full') AS 'is_roster_full';`,
    [user.username, league.id, league.id], function(err, rows, cols) {
        if(err) {
            res.redirect(303, '/myteam/' + league.id);
        }
        else {
            if(rows[0].is_roster_full === 'roster spot available') { 
                dbcon.query(`SELECT playername FROM player WHERE playerID = ?`, [player.id], function(err, rows, cols) {
                    if(err) {
                        res.redirect(303, '/myteam/' + league.id);
                    }
                    else {
                        player.name = rows[0].playername;
                        res.render('add_player', {
                            username: user.username,
                            league: league,
                            player: player
                        });
                    }
                });       
            }
            else {
                res.redirect(303, '/myteam/' + league.id);
            }
        }
    });
});

router.post('/addplayer/:leagueID/:playerID', function (req, res) {
    let user = {
        username: (req.user && req.user.username) ? req.user.username : null
    };
    let league = { id: req.params.leagueID };
    let player = { id: req.params.playerID };

    dbcon.query(`SELECT teamID FROM team WHERE username = ? AND leagueID = ?`, [user.username, league.id], function(err, rows, cols) {
        if(err) {
            res.redirect(303, '/myteam/' + league.id);
        }
        else {
            let teamID = rows[0].teamID;
            dbcon.query(`INSERT INTO player_team (teamID, playerID) VALUES(?,?)`,[teamID, player.id], function(err, rows, cols) {
                if(err) {
                    res.redirect(303, '/myteam/' + league.id + '?error=1');
                }
                else {
                    res.redirect(303, '/myteam/' + league.id);
                }
            });
        }
    });
});

// view all players on the user's team
router.get('/myteam/:leagueID', function (req, res) {
    let user = {
        username: (req.user && req.user.username) ? req.user.username : null
    };
    //console.log(req);

    let league = { id: req.params.leagueID };

    let teamName = "asdf";
    let players = [];
    dbcon.query(`SELECT teamName FROM team WHERE leagueID = ? AND username = ?`,[league.id, user.username], function(err, rows, cols) {
        if(err) {
            //console.log('error loading teamName');
            res.render('myteam', {
                username: user.username,
                league: league,
                teamName: teamName,
                players: players
            });
        }
        else {
            if(rows && rows[0]) { teamName = rows[0].teamName }

            dbcon.query(`SELECT playerID, playername
            FROM player
            WHERE playerID IN 
                (SELECT playerID
                FROM player_team
                WHERE teamID IN
                    (SELECT teamID
                    FROM team
                    WHERE username = ?));`, 
                    [user.username], function (err, rows, cols) {
                if(err) {
                    //console.log('error loading myteam');
                    res.render('myteam', {
                        username: user.username,
                        league: league,
                        teamName: teamName,
                        players: players
                    });
                }
                else {
                    //console.log('getting myteam players...');
                    for (let i = 0; i < rows.length; i++) {
                        players.push({
                            playerID: rows[i].playerID,
                            playername: rows[i].playername
                        });
                    }
                    //console.log(players);

                    res.render('myteam', {
                        username: user.username,
                        league: league,
                        teamName: teamName,
                        players: players
                    });
                }           
            });
        }
    });
});

// show screen confirming that user can, and wants to, drop selected player from their team
router.get('/dropplayer/:leagueID/:playerID', function (req, res) {
    let user = {
        username: (req.user && req.user.username) ? req.user.username : null
    };
    let league = { id: req.params.leagueID };
    let player = { id: req.params.playerID };

   dbcon.query(`SELECT playername FROM player WHERE playerID = ?`, [player.id], function(err, rows, cols) {
        if(err) {
            res.redirect(303, '/myteam/' + league.id + '?error=1');
        }
        else {
            player.name = rows[0].playername;
            res.render('drop_player', {
                username: user.username,
                league: league,
                player: player
            });
        }
    }); 
});

router.post('/dropplayer/:leagueID/:playerID', function (req, res) {
    let user = {
        username: (req.user && req.user.username) ? req.user.username : null
    };
    let league = { id: req.params.leagueID };
    let player = { id: req.params.playerID };

    dbcon.query(`SELECT teamID FROM team WHERE username = ? AND leagueID = ?`, [user.username, league.id], function(err, rows, cols) {
        if(err) {
            res.redirect(303, '/myteam/' + league.id + '?error=1');
        }
        else {
            let teamID = rows[0].teamID;
            dbcon.query(`DELETE FROM player_team WHERE teamID = ? AND playerID = ?`,[teamID, player.id], function(err, rows, cols) {
                if(err) {
                    res.redirect(303, '/myteam/' + league.id + '?error=1');
                }
                else {
                    res.redirect(303, '/myteam/' + league.id);
                }
            });
        }
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
                            else {
                                res.redirect(303, '/');
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
});

router.get('/', function (req, res) {
    console.log(req.User);
    let user = {
        username: (req.user && req.user.username) ? req.user.username : null
    };
    //console.log(req);

    let userLeagues = [];
    dbcon.query(`SELECT leagueID, leagueName 
    FROM league
    WHERE leagueID IN (SELECT leagueID FROM team WHERE username = ?);`, [user.username], function (err, rows, cols) {
        if (err) {
            next(err);
        }
        else {
            for(let i = 0; i < rows.length; i++) {
                userLeagues.push({
                    leagueID: rows[i].leagueID,
                    leagueName: rows[i].leagueName
                });
            }
            let league = {};
            if(userLeagues[0]) {
                league.id = userLeagues[0].leagueID;
            }

            dbcon.query(`SELECT leagueID, leagueName 
            FROM league
            WHERE leagueID IN (SELECT leagueID FROM invite WHERE username = ?);`, [user.username], function (err, rows, cols) {
                if (err) {
                    res.render('home', {
                        username: user.username,
                        userLeagues: userLeagues,
                        league: league
                    });
                }
                else {
                    let invites = [];
                    if (rows[0]) {
                        for(let i = 0; i < rows.length; i++) {
                            invites.push({
                                leagueID: rows[i].leagueID,
                                leagueName: rows[i].leagueName
                            });
                        }
                    }
                    res.render('home', {
                        username: user.username,
                        userLeagues: userLeagues,
                        league: league,
                        invites: invites
                    });
                }
            });
        }
    });
});
router.get('/:viewname', function(req,res,next){
    let user = {
        username: (req.user && req.user.username) ? req.user.username : null
    };
    res.render(req.params.viewname, {
        username: user.username
    }, function(err, html){
        if(!html) return next();
        else res.send(html);
    })
});

module.exports = router;