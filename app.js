var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

var app = express();
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID: '340596080143-74hnckmdcsnb65920pnctnisf5ftjq62.apps.googleusercontent.com',
    clientSecret: '1fQtoeorS81yACCuyvzyzaN-',
    callbackURL: 'http://localhost:3000/auth/google/callback'},
    function(req, accessToken,refreshToken,profile,done){
        done(null, profile);
    }
));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'anything'}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser( (user,done) => {
    done(null, user);
});
passport.deserializeUser( (user,done) => {
    done(null, user); 
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

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

// const port = process.env.PORT || 3000;
// app.listen(port, (err) => {
//     if(err) throw err;
//     else{
//         console.log('Running on port 3000.');
//     }
// });

module.exports = app;
