var mongoose = require('mongoose')
var User = mongoose.model('User')
var Assignment = mongoose.model('Assignment')


var login = function (req, res) {
    
    if (req.session.returnTo) {
        res.redirect(req.session.returnTo)
        delete req.session.returnTo
        return
    }
    return res.redirect('/')  
}

exports.authCallback = login
exports.session = login


exports.loginPage = function (req, res) {
	res.render('index', { message: req.flash('message'), title: 'Login' });
}

exports.signupPage = function(req, res){
	res.render('register',{message: req.flash('message'), title: 'Register'});
};
	
// checks for teacher or student
exports.homePage = function(req, res){
	if (!user) var user
	if (req.user)
		user = req.user
	else
		var user = ""
	if (req.user.type == 'teacher') {
		res.redirect('/teacher');
	} else {
		res.redirect('/assignments');
	}
};

exports.listAssignments = function(req, res) {
	res.render('users/home', { user: req.user, title: 'Home' });
}

exports.logout = function(req, res) {
	req.logout();
	user = ""
	res.redirect('/');
};

exports.getUserAssignments = function(req, res) {
	var user = req.user;
	User.find({ username: user.username }, 'assignments', function (err, userAssignments) {
		if (err) return handleError(err);
		console.log('UserAssignments: ' + userAssignments);
		res.json(userAssignments);
	});
}

// FUNCTIONS FOR DISPLAYING MATRIX //

exports.handleActivity = function(req, res) {
	var activity = req.params.activity;	
	console.log('handling for: ' + activity + ' by ' + req.user.username);
	Assignment.findOne({'title': activity, 'user': req.user.username}, 'data', function(err, person) {
		if (err) return handleError(err);
		if (person) {
			console.log('found person');
			res.redirect('/assignments/' + activity + '/answer')
		} else {
			// load form
			console.log('no person found');
			res.redirect('/assignments/' + activity + '/form')
		}
	})
}

exports.form = function (req, res) {
	var activity = req.params.activity;
	var user = req.user;
	console.log('Getting form for ' + activity + ' for ' + user.username);
	res.render('users/form', {title: 'Matrix', user: user, activity: activity}); 	
}

exports.submit = function (req, res, next) {
	var activityName = req.body.activity;
	var user = req.user;
	console.log('Submitting ' + activityName + ' for ' + user.username);

  // DO SOME OTHER VERIFICATION CHECKING HERE
  
  
  // add assignment title to activity array
  var query = {username:user.username}
  var update = {$push: {'assignments': activityName}};
  User.findOneAndUpdate(query, update, function(err, doc) {
  	if (err) return handleError(err);
  	console.log(doc);
  })
    
  // create assignment
  var newAssignment = new Assignment();
  newAssignment.title = activityName;
  newAssignment.data = req.body.data;
  newAssignment.user = req.user.username;
  newAssignment.date = new Date();
  newAssignment.save(function(err) {
		if (err) {
			console.log('Error in saving assignment: ' + err);
			throw err;
		}
		console.log('Assignment saved');
		res.json({response: 'success'});
	});

}

exports.displayAnswer = function(req, res, next) {
	var activity = req.params.activity;
	var user = req.user;
	console.log('Displaying ' + activity + ' for ' + user.username);
	res.render('users/complete', {title: 'Answers', user: user, activity: activity}); 	
}

exports.getAnswer = function(req, res, next) {
	var activity = req.params.activity;
	var user = req.user;
	console.log('Getting answers ' + activity + ' for ' + user.username);
	Assignment.findOne({'title': activity, 'user': req.user.username}, 'data').lean().exec(function(err, person) {
		if (err) return handleError(err);
		// data is in person.data
		res.json(person.data);
	})
}

