/* jshint esversion: 8 */

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var debug = require('debug')('express-locallibrary:app');
var bunyan = require('bunyan');
var log = bunyan.createLogger({ name: 'express-locallibrary' });
var compression = require('compression');
var helmet = require('helmet');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');

var app = express();

// Add security by setting some standard headers
app.use(helmet());

// Compress all routes
app.use(compression());

viewEngineSetup();
dbConnectionSetup();

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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

module.exports = app;

function viewEngineSetup () {
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({
    extended: false
  }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
}

function dbConnectionSetup () {
  mongoose.connect(dbUri(), {
    useNewUrlParser: true
  })
    .then(debug('connected to db'));
  var db = mongoose.connection;
  db.on('error', (err) => log.error('DB connection error: %s', err));
}

function dbUri () {
  var devUri = 'mongodb+srv://admin:admin@cluster0-pmxkl.azure.mongodb.net/local_library?retryWrites=true&w=majority';
  return process.env.MONGODB_URI || devUri;
}
