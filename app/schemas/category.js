var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var ObjectId = Schema.Types.ObjectId;

var CategorySchema = new Schema({
	name:String,
	movies:[{type:ObjectId,ref:'Movie'}],
	sort:Number,//序号
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
CategorySchema.pre('save',function (next) {
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}

	next()
})

//静态方法---Model就可以执行
CategorySchema.statics =  {
	//查询前5条数据
	fetch:function (callback) {
		return this.find({})
					.populate('movies')
					.sort('meta.createAt')
					.exec(callback);

	},
	//查询单条数据
	findById:function (id,callback) {
		return this.findOne({_id:id})
					.exec(callback);

	}

}

module.exports = CategorySchema;