
var Index = require('../app/controllers/index');

var Movie = require('../app/controllers/movie');

var User = require('../app/controllers/user');

var Comment = require('../app/controllers/comment');

var Category = require('../app/controllers/category');

var multipartMiddleware = require('connect-multiparty')();

/**
 * 暴露出该模块
 * @param  {[type]} app express引用
 * @return {[type]}     [description]
 */
module.exports = function (app) {
	//pre handle 
	app.use(function (req,res,next) {
		var _user = req.session.user;
		app.locals.user = _user;
	    next();	
	})

	/**
	 * 电影首页路由控制
	 */
	//index page
	//电影首页
	app.get('/',Index.index);
	//首页电影分类翻页，搜索功能
	app.get('/index/searchAndPage',Index.searchAndPage);
	// app.get('/index/search',Index.page)

	/**
	 * 用户路由控制
	 */
	//modal signin
	app.post('/user/signin',User.signin);
	//modal signup
	app.post('/user/signup',User.signup);
	//signin page
	app.get('/user/signinpage',User.signinPage);
	//signup page
	app.get('/user/signuppage',User.signupPage);
	//logout 
	app.get('/user/logout',User.logout);
	//userlist
	app.get('/admin/userlist',User.signinRequired,User.adminRequired,User.list);



	/**
	 * 电影路由控制
	 */
	
	//movie detail
	app.get('/admin/movie/detail/:id',User.signinRequired,User.adminRequired,Movie.detail);
	//movie new
	app.get('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.new);
	//movie update
	app.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired,Movie.update);
	//movie save
	// app.post('/admin/movie/save',User.signinRequired,User.adminRequired,multipartMiddleware,Movie.savePoster,Movie.save);
	app.post('/admin/movie/save',User.signinRequired,User.adminRequired,Movie.save);
	//movie list
	app.get('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.list);
	//movie delete
	app.delete('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.del);

	/**
	 * 评论路由的控制
	 */
	app.post('/user/comment/add',User.signinRequired,Comment.save);

	/**
	 * 电影分类路由
	 */
	//category list
	app.get('/admin/category/list',User.signinRequired,User.adminRequired,Category.list);
	//category new
	app.get('/admin/category/new',User.signinRequired,User.adminRequired,Category.new);
	//category save
	app.post('/admin/category/save',User.signinRequired,User.adminRequired,Category.save);
}
