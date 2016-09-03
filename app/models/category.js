var mongoose = require('mongoose');

var CategorySchema = require('../schemas/category');

//模式
var Category = mongoose.model('Category',CategorySchema);

module.exports = Category;

