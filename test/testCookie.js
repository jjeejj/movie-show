var express  = require('express');

var cookieParser  = require('cookie-parser');

var path = require('path')


var port = process.env.PORT || 5000
var app = express();

app.use(cookieParser());

app.use(express.static(path.join(__dirname,'public')))

app.listen(port)


// index page
app.get('/',function (req,res) {
	var taday = new Date()
	var time = taday.getTime() + 60 * 1000;//1s后过期
	var time2 = new Date(time);

	var timeString = time2.toString();

	// res.writeHead(200)
	// res.writeHead(200,{
 //   		'Set-Cookie':'myCookie="type=ninja","language=javascript";path="/";Expires='+timeString+';httpOnly=true'
	// });
	// res.setHead('Set-Cookie','myCookie="type=ninja", "language=javascript";path="/";Expires='+timeString+';httpOnly=true')
	res.setHeader("Set-Cookie", ['language=javascript;path="/";Expires='+timeString+';httpOnly=true', "language=javascript"]);
	res.cookie('haha', 'name1=value1&name2=value2', {maxAge:10*1000, path:'/', httpOnly:true});
	res.end();
})


app.get('/cookie',function (req,res) {
	// 如果请求中的 cookie 存在 isVisit, 则输出 cookie
    // 否则，设置 cookie 字段 isVisit, 并设置过期时间为1分钟
    if(req.cookies.isVisit){
    	console.log(req.cookies);
    	res.send("再次欢迎访问");
    }else{
    	res.cookie('isVisit',1,{maxAge:60 * 1000});
    	res.send("欢迎访问");
    }
})
