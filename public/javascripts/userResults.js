var userListData = [];

// DOM READY //
$(document).ready(function() {
	populateTable();
});


// fill in table with data
function populateTable() {
	var resultsListData = new Array(24+1).join('0').split('').map(parseFloat);
	var tableContent = '';
	//jQuery AJAX call for JSON
	
	var activityName = $('.activityName').text();
	
	$.getJSON('/' + activityName + '/answer', function(data) {
		for (var i = 0; i < data.length; i++) { 
			resultsListData[i] = parseFloat(data[i]);
		}
		
		// populate matrix
		$('.choice').each(function(index) {
			switch (resultsListData[index]) {
				case 1:
					$(this).css('background-color', 'orange');
					break;
				case 2:
					$(this).css('background-color', 'red');
					break;
				default:
					$(this).css('background-color', 'lavender');
					break;
			}
		});
	});
}