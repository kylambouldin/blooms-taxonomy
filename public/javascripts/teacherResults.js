var userListData = [];

// DOM READY //
$(document).ready(function() {
	populateTable();
});


// fill in table with data
function populateTable() {
	var resultsListData = new Array(24+1).join('0').split('').map(parseFloat);
	var tableContent = '';
	
	// find activity results
	var activityName = $('.activityName').text();
	$.getJSON('/teacher/' + activityName + '/results', function(data) {
		for (var i = 0; i < data.length; i++) { 
			userListData[i] = data[i].data;
		}
		
		// show number of submissions
		$('.numSubmissions').html('Number of Submissions: ' + userListData.length);
		
		
		// answers
		for (var i = 0; i < userListData.length; i++){
			var userAnswers = userListData[i];
			// add user to results
			for (j=0; j < userAnswers.length; j++){
				var convertToNumber = parseFloat(userAnswers[j]);
				resultsListData[j] += convertToNumber;
			}
		}
		
		// determine color scheme
		var min = Math.min.apply(Math, resultsListData);
		var max = Math.max.apply(Math, resultsListData);
		var range = max - min;
		var rank = range / 4;

		// populate teacher matrix
		$('.choice').each(function(index) {
			$(this).html(resultsListData[index]);
			if (resultsListData[index] < rank) {
				$(this).css('background-color', '#eff3ff'); // lightest
			} else if (resultsListData[index] < 2*rank) {
				$(this).css('background-color', '#bdd7e7');
			} else if (resultsListData[index] < 3*rank) {
				$(this).css('background-color', '#6baed6');
			} else {
				$(this).css('background-color', '#2171b5'); //darkest
			}				
		});
	});
}