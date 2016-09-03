var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MovieSchema = new Schema({
	doctor: String,
	title: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	poster: String,
	year: String,
	category:{type:ObjectId,ref:'Category'},//目前一个电影就一个分类
	pageview:{type:Number,dafault:0}, //访问量
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
MovieSchema.pre('save',function (next) {
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}

	next()
})

//静态方法---Model就可以执行
MovieSchema.statics =  {
	//查询所有的数据
	fetch:function (callback) {
		return this.find({})
					.sort({'meta.updateAt':-1})
					.exec(callback);

	},
	//查询单条数据
	findById:function (id,callback) {
		return this.findOne({_id:id})
					.exec(callback);

	}

}

module.exports = MovieSchema;