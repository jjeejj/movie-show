;$(function () {
	$('.comment').click(function (e) {
		var target = $(e.target)
		
		var toId = target.data('tid');//回复给谁

		var commentId = target.data('id');//该条评论

		//添加判断之前是否有该隐藏域
		//回复给谁的id隐藏域
		if($('#toId').length > 0){
			$('#toId').val(toId);
		}else{
			//添加隐藏域
			$('<input>').attr({
				type:'hidden',
				id:'','toId',
				name:'comment[tid]',
				value:toId
			}).appendTo('#commentFrom');
		}
		//该条评论id的隐藏域
		if($('#commentId').length > 0){
			$('#commentId').val(commentId);
		}else{
			//添加隐藏域
			$('<input>').attr({
				type:'hidden',
				id:'commentId',
				name:'comment[cid]',
				value:commentId
			}).appendTo('#commentFrom');
		}		
	})
}