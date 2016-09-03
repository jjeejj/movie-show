var Category = require('../models/category');

/**
 * 录入电影栏目的页面
 * @param  {[type]} req 
 * @param  {[type]} res 
 * @return {[type]}     
 */
exports.new = function (req,res) {
	res.render('category_admin',{
		category:{
			name:'',
			sort:''
		}
	})
}
/**
 * 保存电影分类信息
 * @param  {[type]} req 
 * @param  {[type]} res 
 * @return {[type]}    
 */
exports.save = function (req,res) {
	var _category = req.body.category;

	var category = new Category(_category);

	//保存
	category.save(function (err,category) {
		if(err){
			console.log(err);
		}
		res.redirect('/admin/category/list')
	})
}
//电影分类列表
exports.list = function (req,res) {
	Category.fetch(function (err,categories) {
		if(err){
			console.log(err);
		}
		res.render('category_list',{
			title:'电影分类列表',
			categories:categories
		})
	})
}

