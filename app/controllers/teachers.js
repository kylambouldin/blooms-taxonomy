var mongoose = require('mongoose')
var User = mongoose.model('User')
var Assignment = mongoose.model('Assignment')

var User = require('../models/user')

exports.homePage = function (req, res) {
	res.render('teachers/home', { user: req.user, title: 'Teacher' });
}

exports.displayResults = function(req, res) {
	var activity = req.params.activity;
	res.render('teachers/results', { title: 'Results', user: req.user, activity: activity });
}

exports.getResults = function(req, res) {
	var activity = req.params.activity;
	console.log('Getting results for ' + activity);
	Assignment.find({ title: activity }, 'data', function (err, results) {
		if (err) return handleError(err);
		console.log(results);
		res.json(results);
	});
}