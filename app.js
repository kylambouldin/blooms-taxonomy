// Import Dependencies
var express 			= require('express');
var morgan				= require('morgan');
var path 					= require('path');
var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');
var fs						= require('fs');

// Set up Datebase
var dbConfig = require('./config/db');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

// Initialize Application
var app = express();

// set up View Engine
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'jade');

// Register Models
var modelsPath = __dirname + '/app/models'
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file)
  }
})

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

app.listen(8080);   
console.log('Magic happens on port 8080');


// Configure Passport
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: 'foo',
    store: new MongoStore({
		url: dbConfig.url,
		collection : 'sessions'
	})
}));

app.use(passport.initialize())
app.use(passport.session())

// Initialize Passport
var initPassport = require('./config/passport/init');
initPassport(passport);

// Use flash middleware to store messages in session and display in templates
var flash = require('connect-flash');
app.use(flash());

// Connect main router
var routes = require('./config/routes')(passport);
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

module.exports = app;