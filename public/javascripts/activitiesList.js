var userCompletedAssignments = [];

$(document).ready(function() {
	$.getJSON('/users', function(data) {
		userCompletedAssignments = data[0].assignments.slice();
		if ($('div').hasClass('student')){
			fillActivitiesTable('assignments');
		}
		if ($('div').hasClass('teacher')){
			fillActivitiesTable('teacher');
		}
	})
})

// FUNCTIONS //

/*
 * Gets JSON file and makes a list of each activity item title
 */
function fillActivitiesTable(type) {
	var activityTable = '';
	$.getJSON('/ajax/activities.json', function(data) {
		activityTable += '<table class="table table-hover table-bordered">';
		$.each(data, function() {
			if($.inArray(this.title, userCompletedAssignments) !== -1) {
				activityTable += '<tr class="success"><td><p><a href="' + type + '/' + this.title +'">' + this.title + '</a><br/>'+ this.description +'</p></td></tr>';
			} else {
				activityTable += '<tr><td><p><a href="' + type + '/' + this.title +'">' + this.title + '</a><br/>'+ this.description +'</p></td></tr>';
			}
		});
		activityTable += '</table>';
		$('.activitiesTable').html(activityTable);
	})
}