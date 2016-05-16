$(window).load(function() {
	$('.press').jMosaic({
		items_type: "a", // Type of elements in the selector (Default: img);
		min_row_height: 200, // Minimal row height (Default: 150);
		margin: 5, // Space between elements (Default: 0);
		is_first_big: true // First row - largest (Default: false);
	});
});
