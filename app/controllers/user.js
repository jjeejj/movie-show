var User = require('../models/user')

//signUp--注册
//
//app.post('/user/signup')
exports.signup = function (req,res) {

	var _user = req.body.user;

	//判断该用户名之前是否注册过
	User.find({name:_user.name},function (err,users) {
		if(err){
			console.log(err);
		}

		if(users && users.length != '0'){
			console.log(users);
			//已结注册定位到登录页面
			return res.redirect('/user/signinpage')
		}else{
			var user = new User(_user);
			user.save(function (err,user) {
				if(err){
					console.log(err);
				}
				// console.log(user);
				return	res.redirect('/')
			})
		}
	})
}

//signin --登录
//app.post('/user/signin',)
exports.signin = function (req,res) {
	var _user = req.body.user;

	var name = _user.name;
	var password = _user.password;

	User.findOne({name:name},function (err,user) {
		if(err){
			console.log(err);
		}
		//用户不存在---重定向注册页面
		if(!user){
		 	return res.redirect('/user/signuppage');
		}

		/**
		 * 验证密码是否匹配
		 * @param  {[type]}  err  回调错误信息
		 * @param  {Boolean} isMatch  是否匹配 true or false
		 * @return {[type]}   
		 */
		user.comparePassword(password,function (err,isMatch) {
			if(err){
				console.log(err);
			}
			if(isMatch){
				req.session.user = user;
				console.log('Password is matched');
				return res.redirect('/')
			}else{
				console.log('Password is not matched');
				//密码不对 --- ---重定向注册页面
				return res.redirect('/user/signinpage');
			}
		})
	})
}

//logout--登出的功能
//app.get('/logout',)
exports.logout = function (req,res) {

	delete req.session.user; //删除来用户的session

	res.redirect('/')
}


// user-list page
// app.get('/admin/userlist',)
exports.list = function (req,res) {
	console.log('users list');
	//查询所有的记录
	User.fetch(function (err,users) {
		if(err){
			console.log(err);
		}else{
			res.render('user-list',{
			 title:'用户列表',
			 users:users
			})		
		}
	});		
}

//signin page
exports.signinPage = function (req,res) {
	res.render('signin',{
	 	title:'登录页面',
	})		
}
//signup page
exports.signupPage = function (req,res) {
	res.render('signup',{
	 	title:'注册页面',
	})		
}

/**
 * middleware for user
 * 判断用户是否登录过
 */
exports.signinRequired = function (req,res,next) {
	var user = req.session.user;
	//用户没有登录过，跳到登录页面
	if(!user){
		return res.redirect('/user/signinpage')
	}
	next();
}

/**
 * middleware for user
 * 权限中间件
 */
exports.adminRequired = function (req,res,next) {
	var user = req.session.user;
	// console.log("adminRequired user=====",user);
	if(user.role == undefined || user.role <= 10){
		return res.redirect('/user/signinpage')
	}
	next();
}

/**
 * 更新用户信息页面
 */

exports.updatePage = function (req,req) {
	
}

/**
 * 保存更新的用户信息
 */

exports.updateSave = function (req,res) {
	
}

/**
 * 删除用户信息
 */

exports.del = function (req,res) {
	
}