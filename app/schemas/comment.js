var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ObjectId = Schema.Types.ObjectId;


var CommentSchema = new Schema({
	//评论电影
	movieId:{
		type:ObjectId,
		ref:'Movie'
	},
	//评论来自于谁
	from:{
		type:ObjectId,
		ref:'User'
	},
	//回复
	reply:[{
		//来自谁
		from:{type:ObjectId,ref:'User'},
		//评论给谁
		to:{type:ObjectId,ref:'User'},
		//回复的内容
		content:String,
	}],
	content:String,
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

//pre中间件--save前执行---document---赋值创建时间和更新时间
CommentSchema.pre('save',function (next) {
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}

	next()
})

//静态方法---Model就可以执行
CommentSchema.statics =  {
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

module.exports = CommentSchema;