var mongoose = require('mongoose');

var crypto = require('crypto');//node自带的模块

var bcrypt = require('bcrypt-nodejs');//加密模块

var key = '34ggfgfhyuyuy';

var SALT_WORK_FACTOR = 10;


var UserSchema = new mongoose.Schema({
	name:{
		type:String,
		unique:true
	},
	password:String,
	/**
	 * role
	 * 0:normal user
	 * 1:verifiled user
	 *
	 * >10 admin
	 * >50 super admin
	 * 
	 */
	role:{
		type: Number,
		default: 0
	},
	meta: {
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}

})

//pre中间件--save前执行---document
UserSchema.pre('save',function (next) {
	var user  = this;
	if(this.isNew){ //TODO isNew该方法？？？？？？
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	//生成salt----并加密
	bcrypt.genSalt(SALT_WORK_FACTOR,function (err,salt) {
		if(err){
			return next(err);
		}
		bcrypt.hash(user.password,salt,null,function (err,hash) {
			if(err){
				return next(err);
			}
			user.password = hash;
			next()
		})
	});
	// var cpassword = crypto.createHmac('md5', key);
	// user.password = cpassword.update(user.password).digest('hex');
	
})

//静态方法---Model就可以执行
UserSchema.statics =  {
	//查询所有的数据
	fetch:function (callback) {
		return this.find({})
					.sort('meta.updateAt')
					.exec(callback);

	},
	//查询单条数据
	findById:function (id,callback) {
		return this.findOne({_id:id})
					.exec(callback);

	}

}

//实例方法
UserSchema.methods = {
	comparePassword:function (_password,cb) {
		bcrypt.compare(_password, this.password,function (err,isMatch) {
			if(err){
				return cb(err)
			}
			cb(null,isMatch)
		});
	}
}
module.exports = UserSchema;