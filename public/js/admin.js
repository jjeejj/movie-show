/**
 * [description] 电影删除功能
 * @param  {[type]} )  {	$('.del').click(function (e) {		var target [description]
 * @return {[type]}   [description]
 */
;$(function () {
	$('.del').click(function (e) {
		var target = $(e.target)
		// debugger;
		console.log('delete----------------------------');
		var id = target.data('id')

		var tr = $('.item-id-'+id)

		//删除操作
		$.ajax({
			method:'DELETE',
			dataType:'json',
			url:'/admin/movie/list?id='+id
		}).done(function (results) {
			console.log('results============',results);
			if(results.success === 1){
				if(tr.length >0){
					tr.remove()
				}
			}
		})
	})
})

//通过豆瓣获取电影资源
$('#douban').blur(function () {
	var douban = $(this);

	var id = douban.val();
	console.log('douban id:',id);
	if(id){
		$.ajax({
			url:'https://api.douban.com/v2/movie/subject/'+id,
			type:'get',
			cache:true,
			dataType:'jsonp',
			crossDomain:true,
			jsonp:'callback'
		}).done(function (data) {
			//赋值
			$('#inputTitle').val(data.title);
			//导演的名字
			var directorsName = [];
			for (var i = 0; i < data.directors.length; i++) {
				directorsName.push(data.directors[i].name)
			}
			$('#inputDoctor').val(directorsName.join(','));
			$('#inputCountry').val(data.countries.join(','));
			$('#inputLanguage').val(data.languages);
			$('#inputPoster').val(data.images.large);
			// $('#inputFlash').val(data.);
			$('#inputYear').val(data.year);
			$('#inputSummary').val(data.summary);
		})
	}
})