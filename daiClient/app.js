var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var busboy = require('connect-busboy');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dataClientRouter = require('./routes/dataclient');
var modelClientRouter = require('./routes/modelclient');
var  config = require('./config/config')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(busboy({ immediate: true }));
app.use(logger('dev'));
app.use(express.json());
// app.use(bodyParser.json()); 　
// app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dataclient', dataClientRouter)
app.use('/modelclient', modelClientRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
