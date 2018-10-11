let express = require('express');
let bodyParser = require('body-parser');
let net = require('net');
let cookieParser = require('cookie-parser');
let session = require('cookie-session');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let app = express();
let credentials = require(__dirname + '/credentials.js');
let dbcon = require('./lib/mysqlDBMgr.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(session({ keys: [credentials.cookieSecret] }));
app.use(passport.initialize());
app.use(passport.session());
let handlebars = require('express-handlebars').create({
	defaultLayout: 'main',
	helpers: {
		json: function (context) {
			return JSON.stringify(context).replace(/"/g, '&quot;');
		}
	}
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

console.log('running from ' + __dirname);


let test = function (username, password, done) {
        var loggedInUser;
        console.log("inside passport strat");
        dbcon.query('select * from login where username = ? and password = AES_Encrypt(?,?);',[username,password,require(__dirname + '/credentials.js').loginKey], function(err,rows,cols){
        	console.log(rows);
        	if(!err && rows && rows[0]){
        		return done(null, rows[0]);
        	}else {
        		return done(null, false, {message: "Failed to login (Bad Credentials?)"});
        	}
        });
}

test('CES_the_reaper','smasm1sn3ila',function(test1,test2){
	console.log(test1);
	console.log(test2);
})


/* define local strategy for login here when db protocol known*/
passport.use(new LocalStrategy(test));
/* passport.serializeUser/deserializeUser for mysql */

passport.serializeUser(function (user, done) {
	console.log(user);
    done(null, user.username);
});
passport.deserializeUser(function (username, done) {
    var loggedInUser;
    console.log("deserializing");
    dbcon.query('select username, password from login where username = ?;', [username], function(err, rows, cols){
        console.log(rows);
        if (err || !rows || !rows[0]) {
        	console.log("Failed Login")
            return done(null, false, { message: 'Failure... :(' });
        } else {
            loggedInUser = rows[0];
            console.log(loggedInUser);
            return done(null, loggedInUser);
        }
    });
});

app.use(express.static(__dirname + '/public'));
app.use('/', require(__dirname + '/routes.js'));

app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	if(req.url)
	err.request = req.url;
	next(err);
});

app.set('env', 'development');

if(app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		console.log(err);
		res.status(err.status || 500);
		if(err.request){
			res.render('error', {
				message: err.message,
				error: err,
				request: err.request,
				code: err.status || 500
			})
		}else
		res.render('error', {
			message: err.message,
			error: err,
			code: err.status || 500
		})
	});
}

app.use(function (err, req, res, next) {
	console.log(err);
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {},
		code: err.status || 500
	});
});



app.listen(app.get('port'), function() {
	console.log('Express started on http://localhost:' + 
		app.get('port') + 
		'; press Ctrl-C to terminate.')
});








