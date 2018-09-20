let express = require('express');
let bodyParser = require('body-parser');
let net = require('net');
let cookieParser = require('cookie-parser');
let session = require('cookie-session');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let app = express();


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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

/* define local strategy for login here when db protocol known*/

/* passport.serializeUser/deserializeUser for mysql */

app.use(express.static(__dirname + '/public'));
app.use('/', require(__dirname + '/routes.js'));

app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.set('env', 'development');

if(app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		console.log(err);
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		})
	});
}

app.use(function (err, req, res, next) {
	console.log(err);
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});



app.listen(app.get('port'), function() {
	console.log('Express started on http://localhost:' + 
		app.get('port') + 
		'; press Ctrl-C to terminate.')
});








