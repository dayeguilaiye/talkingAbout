function addtext(){
	var boxs = $(".textbox");
	var newbox = $(".textbox:last").clone();
	$(".textbox:last").append($(".textbox:last").clone());
	$(".textbox:last").find('textarea').val('');
}