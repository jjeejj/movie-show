var mongoose = require('mongoose')

var UserSchema = require('../schemas/user')

//模式
var User = mongoose.model('User',UserSchema)

module.exports = User;