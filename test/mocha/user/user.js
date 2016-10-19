var crypto = require('crypto');

var bcrypt = require('bcrypt-nodejs');

var should = require('should');//断言模块

var app = require('../../../app');

var mongoose = require('mongoose');

var User = require('../../../app/models/user');

/**
 * 生成密码学强度的伪随机数据
 * @param  {[type]} len长度
 * @return {[type]}  字符串
 */
function getRandomString(len) {
	if(!len){
		len = 16;
	}

	return crypto.randomBytes(Math.ceil(len /2).toString('hex'));
}

//test
descripe('<Unit Test',function () {
	descripe('Model User:',function () {
		
	})
})

