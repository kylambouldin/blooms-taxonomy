$(document).ready(function(){

	//  handles buttons	
	$('#btnCancel').on('click', cancel)
	$('#btnSubmit').on('click', submit);
	
	// allows bootstrap and jQueryUI to work simultaneously 
	$.widget.bridge('uitooltip', $.ui.tooltip);
	$(document).uitooltip({
		show: {
			effect: "slideDown",
			delay: 150
		},
		position: { 
			my: "bottom", // tooltip box location
			at: "top"  // div location
		}
	});
	
	// get description from activity name (Normally this can be found in User Cntrl using database model)
	var activityName = $('.activityName').text();
	$.getJSON('/ajax/activities.json', function(data) {
		$.each(data, function() {
			if (this.title == activityName) {
				$('.activityDescription').html(this.description);
			}
		});
	});
	
		
	// toggles and enables dragging for highlighting cells
	$(".col-sm-1").mousedown(function() {
		if (!$(this).hasClass('red')){
		    $(this).toggleClass('highlight');
	    	$(".col-sm-1").mouseenter(function () {
	    		if (!$(this).hasClass('red')){
					$(this).toggleClass('highlight');
				}
			});		
		}
  });
  $(document).mouseup(function (){
		$('.col-sm-1').off('mouseenter')
  })

	// enables double click for red cell
    $(".col-sm-1").dblclick(function(){
			if ($(this).hasClass('red')) {
    		$(this).removeClass('red');
				$(this).addClass('highlight');
    	} else {
    		// remove other red class
				$('.choice').each(function(index) {
					if ($(this).hasClass('red')) {
						$(this).removeClass('red');
						$(this).addClass('highlight');
					}
				});
				// add red class
				$(this).addClass('red');
				$(this).removeClass('highlight');
    	}
    });    
});

function cancel(event) {
	window.history.back(-1);  
}

// Add User
function submit(event) {
	event.preventDefault();
	// compile info into one object
	var matrixObject = [];
	$('.choice').each(function(index) {
		if ($(this).hasClass('highlight')) {
			matrixObject[index] = 1;
		} else if ($(this).hasClass('red')){
			matrixObject[index] = 2;
		} else {
			matrixObject[index] = 0;
		}
	});
	
	var activityName = $('.activityName').text();
	
	var newUser = {
		'data': matrixObject,
		'activity': activityName
	}
	// Use AJAX to post object to service
	$.ajax({
		type: 'POST',
		data: newUser,
		url: '/submit',
		traditional: true,
		dataType: 'JSON',
	}).done(function(data) {
		if (data.response == 'success') {
			location.href = '/assignments/' + activityName;
		}
	})
}