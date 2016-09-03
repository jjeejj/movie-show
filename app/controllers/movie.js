var _ = require('underscore');
var Movie = require('../models/movie');
var Comment = require('../models/comment');

var Category = require('../models/category');

var fs = require('fs');

var util = require('util');

//文件上传模块
var multiparty = require('multiparty');

// detail page
// app.get('/admin/movie/detail:id',)
// 还要查出该电影的所有评论
exports.detail = function (req,res) {
	
	console.log('/movie/:id');
	var id = req.params.id;

	//查询一条记录
	Movie.findById(id,function (err,movie) {
		if(err){
			console.log(err);
			return;
		};
		//访问量
		Movie.update({_id:id},{$inc:{pageview:1}},function (err) {
			if(err){
				console.log(err);
				return;
			}
		});
		Comment
			.find({movieId:id})
			.populate('from','name')
			.populate('reply.from','name')
			.populate('reply.to','name')
			.exec(function (err,comments) {
					if(err){
						console.log(err);
						return;
					}
					console.log('comments:',comments);
					res.render('detail',{
						 title:'详情:' + movie.title,
						 movie: movie,
						 comments:comments
					})	
				})	
	})	
}

// admin page
// app.get('/admin/movie/new',)
// 查出所有的电影分类
exports.new = function (req,res) {
	Category.fetch(function (err,categories) {
			res.render('admin',{
				 title:'电影录入页',
				 movie: {},
		        categories:categories
			})
		})	
}

// admin update movie 
//app.get('/admin/movie/update/:id',)
exports.update = function (req,res) {
	var id = req.params.id;
	if(id){
		//查询一条记录
		Movie.findById(id,function (err,movie) {
			if(err){
				console.log(err);
			}
			Category.fetch(function (err,categories) {
				 res.render('admin',{
					 title:movie.title,
					 movie: movie,
					 categories:categories
				})	
			})
			
		})	
	}
}

//admin save poster 保存海报的中间件（上传文件） --multiparty
exports.savePoster1 = function (req,res,next) {
	
	//解析文件上传
	var form = new multiparty.Form({uploadDir:''});

	form.parse(req,function (err,fields,files) {
		if(err){
			console.log(err);
			return;
		}
		Object.keys(fields).forEach(function (name) {
			console.log('got field named -------------------' + name);
		})
		console.log('got field -----------------' + util.inspect(fields))
	})

	// next(req);
}

//admin save poster 保存海报的中间件（上传文件） --multiparty
exports.savePoster = function (req,res,next) {
	
	//经过上次connect-mutlipart中间件解析过的数据
	console.log(req.files);
	var posterData = req.files.upLoadPoster;
	var filepath = posterData.path;//文件路径
	var originaFileName = posterData.originaFileName;//文件的原始名字
	if(originaFileName){
		//读取文件
		fs.readFile(filepath, function (err,data) {
			var timestamp = Date.now();
			//文件类型
			var type = posterData.type.split('/')[1];
			var poster = timestamp +'.'+type;
			var newPath = path.join(__dirname,'../../','/public/upload'+poster);

			//写文件
			fs.writeFile(newPath, data, function (err) {
				if(err){
					console.log(err);
					return;
				}
				req.poster = newPath
			});
		});
	}

	next();
}
// admin post  save movie
// app.post('/admin/movie/save',)
exports.save = function (req,res) {
	var id = req.body.movie._id;
	// console.log('movie id:',id);
	var movieObj = req.body.movie;
	console.log('movieObj:',movieObj);
	//如果有上传的文件
	if(req.poster){
		movieObj.poster = req.poster;
	}
	var _movie;
	// console.log('qeuql undefined ?',id !== undefined && id !== "" && id !== null && id != 'undefined');
	//之前存在--更新
	if(id !== undefined && id !== "" && id !== null && id != 'undefined') {
		console.log("========================");
		//查询该条记录
		Movie.findById(id,function (err,movie) {
			if(err){
				console.log(err);
			}
			// console.log('movieObj:',movieObj);
			_movie = _.extend(movie,movieObj);
			console.log('_movie:',_movie);
			_movie.save(function (err,movie) {
				if(err){
					console.log(err);
				}

				//重定向到详情页面
				res.redirect('/movie/'+movie._id)
			});
		})
	}else{
		console.log("--------------------------------");

		_movie = new Movie({
			category:movieObj.category,
			doctor:movieObj.doctor,
			title:movieObj.title,
			language:movieObj.language,
			country:movieObj.country,
			summary: movieObj.summary,
			flash: movieObj.flash,
			poster: movieObj.poster,
			year: movieObj.year
		});
		// _movie = new Movie(movieObj);  //这样复制会把_id复制过去
		console.log('_movie:',_movie);
		
		var categoryId = movieObj.category;
		var categoryCus = movieObj.categoryCus;
		console.log('categotyId----------------',categoryId);
		console.log('categoryCus----------------',categoryCus);

		_movie.save(function (err,movie) {
				if(err){
					console.log(err);
					return;
				}
				//如果有分类id
				if(categoryId){
					//给该电影对应的分类添加对应的电影id
					Category.findById(categoryId,function (err,category) {
						if(err){
							console.log(err);
							return;
						}
						category.movies.push(movie._id);
						category.save(function (err,category) {
							//重定向到详情页面
							res.redirect('/admin/movie/detail/'+movie._id)
						})
					})	
				}else if(categoryCus){//如果新增一个分类
					var category = new Category({
										name:categoryCus,
										movies:[movie._id]
									})
					category.save(function (err,category) {
							movie.category = category._id;
							movie.save(function (err,movie) {
								//重定向到详情页面
								res.redirect('/admin/movie/detail/'+movie._id)
							})					
					})
				}							
			});
	}	
}


// list page
// app.get('/admin/movie/list',)
exports.list = function (req,res) {
	console.log('admin list');
	//查询所有的记录
	Movie.fetch(function (err,movies) {
		if(err){
			console.log(err);
		}else{
			res.render('list',{
			 title:'列表',
			 movies:movies
			})		
		}
	});		
}



// list delete movie
// app.delete('/admin/movie/list',)
exports.del = function (req,res) {
	var id = req.query.id;
	console.log('delete id',id);
	if(id){
		Movie.remove({_id:id},function (err,movie) {
			if(err){
			console.log(err);
			}else{
			//重定向到列表页面
			// res.redirect('/admin/list')
			res.json({success:1})
			}
		})
	}
}
