var express = require('express')
var morgan = require('morgan')

var path = require('path')

var fs = require('fs')

var app = express()

console.log(__dirname);
console.log(process.cwd());

//create log stream
var accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})

morgan.format('test',':method :url HTTP/:http-version');


morgan.compile('test');

// app.use(morgan(':method :url HTTP/:http-version :date[iso] :referrer :remote-addr :remote-user :req[header] :res[header] :status :user-agent :response-time[4]'))
app.use(morgan('test',{
	stream:accessLogStream
}))


app.listen(4000)
app.get('/', function (req, res) {
  res.send('hello, world!')
})