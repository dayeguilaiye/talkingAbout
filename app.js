var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('sessiontest'));
app.use(session({
    secret: 'sessiontest', //与cookieParser中的一致
    resave: true,
    saveUninitialized: true
}));

app.use(function(req, res, next) {
    if ((!req.session) || (!req.session.user)) {
        console.log(req.url)
        if (req.url == "/login" || req.url == "/register") {
            next(); //如果请求的地址是登录则通过，进行下一个请求
        } else {
            console.log("有未经登录的请求");
            res.redirect('/login');
        }
    } else if (req.session.user) {
        next();
    }


    // 此处先关闭登录验证，方便调试
    // req.session.user = 'haha';
    // req.session.userId=11;
    // next();
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
