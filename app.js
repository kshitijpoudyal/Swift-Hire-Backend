var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongoskin');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');

var index = require('./routes/index');
var job = require('./routes/job');

var db = mongo.db('mongodb://swifthire:swifthire123@ds043262.mlab.com:43262/swifthire');
db.bind('jobs');
db.bind('users');
// bind collections here...

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


// We are going to implement a JWT middleware that will ensure the validity of our token. We'll require each protected route to have a valid access_token sent in the Authorization header
const authCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 100,
        jwksUri: "https://swifthire.auth0.com/.well-known/jwks.json"
    }),
    // This is the identifier we set when we created the API
    audience: '4dj7RpeuSXB4K2meiDdxCeo82FxfNIBV', //clientID
    issuer: "https://swifthire.auth0.com/", //domain
    algorithms: ['RS256']
});

app.use(function (req, res, next) {
    req.db = db;
    next();
});

// app.use('/', authCheck, index);
// app.use('/job', authCheck, job);

app.use('/', index);
app.use('/job', job);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(8080);
db.close();
module.exports = app;
