// index page
var Movie = require('../models/movie');
var Category = require('../models/category');



exports.index = function (req,res) {
	console.log('req.session.user',req.session.user);
	//查询所有电影的记录
	//所有分类进行遍历
	Category.fetch(function (err,categories) {
		// console.log('categories:',categories);
		if(err){
			console.log(err);
		}
		res.render('index',{
		 title:'首页',
		 categories: categories
		})
	})

	// Category.find({})
	// 		.populate({path:'movies',options:{limit:5}})
	// 		.exec()
}

/**
 * 电影分页
 * 电影搜索翻页
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.searchAndPage = function (req,res) {
	// console.log('req.session.user',req.session.user);
	var page_count = 1;
	var cateId = req.query.cateId; //栏目id
	var page = Number(req.query.page) || 0; // 分页---第几页---从0开始的
	var search = req.query.search; //查询条件--电影名称
	//查询索引位置
	var index = page * page_count ; //开始查询的位置

	if(cateId){ //栏目分页查看
		Category.find({_id:cateId})
				.populate({
					path:'movies'
					// options:{limit:page_count,skip:index} // 一对多的关系
				})
				.exec(function (err,categories) {
					if(err){
						console.log(err);
					}
					var category = categories[0] || {};


					var movies = category.movies || [];
					//手动控制分页，开始查询的位置
					var result = movies.slice(index,index + page_count);//[start,end)

					// console.log('totalPage:-----------------------',Math.ceil(movies.length / page_count));
					// console.log('queryString: ','cateId='+cateId);

					res.render('index_result',{
						title:'结果列表',
						currentPage:(page+1),//当前页码
						totalPage:Math.ceil(movies.length / page_count),//全部页码
						queryString:'cateId='+cateId,//栏目id
						keyword:category.name,
						movies:result //直接传过去的是电影数组
						// result:result
					})
				})
	}else if(search){ // 电影名称搜索
		Movie.find({title:new RegExp(search,'i')})
			 .exec(function (err,movies) {
			 	if(err){
			 		console.log(err);
			 	}
			 	//控制分页数量
			 	var result = movies.slice(index,index + page_count);//[start,end)
			 	res.render('index_result',{
			 		title:'结果列表',
			 		currentPage:(page+1),//当前页码
			 		totalPage:Math.ceil(movies.length / page_count),//全部页码
			 		queryString:'search='+search,//搜索关键字
			 		keyword:search,
					movies:result //直接传过去的是电影数组
			 	})
			 })
	}
}

//根据电影名字进行搜索----todo废弃的
exports.search = function (req,res) {
	var search = req.query.search;
	var page = Number(req.query.page) || 0;
	var index = page * page_count ; //开始查询的位置
	var page_count = 3;

	//搜索后的结构都是默认第一页
	Movie.find({title:/search/}) //正则匹配
		.exec(function (err,movies) {
			if(err){
				console.log(err);
			}

			var result = movies.slice(index,index + page_count);//[start,end)
			res.render('index_result',{
					title:'结果列表',
					currentPage:(page+1),//当前页码
					totalPage:Math.ceil(movies.length / page_count),//全部页码
					cateId:cateId,//栏目id
					keyword:search,
					movies:result //直接传过去的是电影数组
					// result:result
				})
		})
}