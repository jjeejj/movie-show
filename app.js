var express  = require('express')
var path = require('path')
var mongoose = require('mongoose')

var bodyParser = require('body-parser')
var session = require('express-session');

var serveStatic = require('serve-static');

var mongoStore = require('connect-mongo')(session);

var logger = require('morgan');


var port = process.env.PORT || 3000
var app = express();

var dbUrl = 'mongodb://localhost/movies';

//本地数据库

// var dbConnc = mongoose.connection;
mongoose.connect(dbUrl);

// dbConnc.on('error',function (err){
// 	console.log('connection error');
// }); 

/**
 * 测试连接数据库是否成功
 * 打印出对应的信息
 */
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:Please try again'));
db.once('open', function (callback) {
  console.log('connection success');
});


//本地变量--真个工程都可以用
app.locals.moment = require('moment')

app.set('views','./app/views/pages')
app.set('view engine','jade')
app.use(serveStatic(path.join(__dirname,'public')))
// app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({
    extended: true //qs
}))
app.use(bodyParser.json())


app.use(session({
	resave: false,
  	saveUninitialized: true,
	secret:'jjeejj',
	store:new mongoStore({
		url:dbUrl,
		collection:'session'
	})

}))
require('./config/routes.js')(app);

//开发环境--生产环境--测试环境---http请求日志打印信息
var env= process.env.NODE_ENV || 'development';
if('development' === env){
	app.set('showStrackError',true);
	app.use(logger('dev'));
	app.locals.pretty = true;
	// mongoose.set('debug',true); //是否开启mongoose查询打印日志
}
app.listen(port)

console.log('server is starting on',port);

