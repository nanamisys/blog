var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var crypto = require('crypto');
var mongoose = require('mongoose');
var passport = require('passport');
// var connect = require('connect');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var localStrategy = require('passport-local').Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var post = require('./routes/post');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// middleware
app.use(flash());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded());
app.use(session({secret: 'hoge'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
}));

// routing
app.get('/', post.index);
app.get('/about', post.about);
app.get('/login', post.login);
app.get('/posts/:id([0-9]+)', post.show);
app.get('/posts/new', post.new);
app.post('/posts/create', post.create);
app.get('/posts/:id/edit', post.edit);
app.put('/posts/:id', post.update);
app.delete('/posts/:id', post.destroy);
app.get('/posts/img/:pic', function(req, res){
    res.sendfile(__dirname + '/public/img/' + req.params.pic);
});

// Authentication
passport.use(new localStrategy({
  usernameField: 'name',
  passwordField: 'password',
  passReqToCallback: true},
  function(req, name, password, done){
      process.nextTick(function(){
          var Account = mongoose.model('Account');
          Account.findOne({"id": name}, function(err, account){
              if (err) return done(err);
              if (!account){
                  req.flash('error', 'ユーザーが見つかりません。');
                  req.flash('inpurt_id', name);
                  req.flash('input_password', password);
                  return done(null, false);
              }
              var hashedPassword = getHash(password);
              if (account.password != hashedPassword && account.password != password){
                  req.flash('error', 'パスワードが間違っています。');
                  req.flash('input_id', name);
                  req.flash('input_password', password);
                  return done(null, false);
              }
              return done(null, account);
          });
      });
  }
));

// Encryption
var getHash = function(value){
  var sha = crypto.createHmac('sha256', 'secretKey');
  sha.update(value);
  return sha.digest('hex');
};

// Passport
passport.serializeUser(function(account, done){
  done(null, account.id);
});
passport.deserializeUser(function(serializedAccount, done){
  var Account = mongoose.model('Account');
  Account.findOne({"id": serializedAccount}, function(err, account){
      done(err, account.id);
  });
});


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
