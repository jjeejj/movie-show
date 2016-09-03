var _ = require('underscore')
var Comment = require('../models/comment')

// post  save comment
exports.save = function (req,res) {
	
	var _comment = req.body.comment;

	console.log('_comment:',_comment);

	var movieId = _comment.movieId;

	//判断并查询之前的评论
	if(_comment.cid){
		Comment.findById(_comment.cid,function (err,comment) {
			//回复的 内容
			var reply = {
				from:_comment.from,
				to:_comment.tid,
				cotent:_comment.content
			};
			comment.reply.push(reply);
			comment.save(function(err,comment){
					if(err){
						console.log(err);
						return;
					}
					//重定向到详情页面
					return	res.redirect('/admin/movie/detail/'+movieId);
				});
		})
	}else{
		var comment = new Comment(_comment);
		comment.save(function (err,comment) {
			if(err){
				console.log(err);
				return;
			}
			//重定向到详情页面
			return res.redirect('/admin/movie/detail/'+movieId)
		});	

	}
}

