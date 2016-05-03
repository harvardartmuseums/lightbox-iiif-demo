$(function() {
	$(window).on('keydown', function (e) {
		switch (e.keyCode) {
			case 37: // left
				$("#comp_view").toggle();
				$("#standard_view").toggle();
				break;
			case 38: //up
				break;
			case 39: // right
				$("#comp_view").toggle();
				$("#standard_view").toggle();
				break;
			case 40: //down
				break;
			case 73: // i
				break;
			case 86:
				break;
			default:
				console.log(e.keyCode);
		}
	});
});