
// set up 
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var configDB = require('./config/database.js');

// configuration
mongoose.connect(configDB.url); 

require('./config/passport')(passport);

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); 
	app.use(express.cookieParser()); 
	app.use(express.bodyParser()); 
	app.set('view engine', 'ejs'); 

	// required for passport
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); 
	app.use(flash()); 

});

// routes
require('./app/routes.js')(app, passport); 

// launch
app.listen(port);
console.log('App listen on port ' + port);
