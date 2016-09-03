var mongoose = require('mongoose')

var MovieSchema = require('../schemas/movie')

//模式
var Movie = mongoose.model('Movie',MovieSchema)

module.exports = Movie;

