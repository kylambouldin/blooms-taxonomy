var express = require('express');
var mongoose = require('mongoose');
var Assignment = require('../app/models/assignment')
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated, redirect to login page
	res.redirect('/login');
}

var handleError = function(err, req, res, next) {
	//if provided an object
	if (err.err) return errObj(err)      	
	//else provided a string
	return res.json(503, {
		"error": err
	})
	function errObj(err) {
		var msg = {} 
		if (err.tip) msg.tip = err.tip
		if (err.err) msg.error = err.err
		return res.json(503, msg)
	}
}

module.exports = function(passport) {
	// USER CONTROLLER
	var users = require('../app/controllers/users')
	router.get('/', isAuthenticated, users.homePage, handleError) 	// checks for teacher or student
	router.get('/login', users.loginPage, handleError)
	router.get('/signup', users.signupPage, handleError)
	router.get('/signout', users.logout, handleError)
	router.get('/assignments', isAuthenticated, users.listAssignments, handleError)
	router.post('/submit', users.submit, handleError)
	
	router.get('/users', users.getUserAssignments, handleError)

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash : true  
	}));

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash : true  
	}));
	
	router.param('activity', function(req, res, next, activity) {
		req.params.activity = activity;
		next();
	});
	
	router.get('/assignments/:activity', isAuthenticated, users.handleActivity, handleError) // direct user to form or results
	router.get('/assignments/:activity/form', isAuthenticated, users.form, handleError)
	router.get('/assignments/:activity/answer', isAuthenticated, users.displayAnswer, handleError)
	router.get('/:activity/answer', isAuthenticated, users.getAnswer, handleError)


	// TEACHER CONTROLLER
	var teachers = require('../app/controllers/teachers')
	router.get('/teacher', isAuthenticated, teachers.homePage, handleError)
	router.param('activity', function(req, res, next, activity) {
		req.activity = activity;
		next();
	});
	router.get('/teacher/:activity', isAuthenticated, teachers.displayResults, handleError)
	router.get('/teacher/:activity/results', isAuthenticated, teachers.getResults, handleError)
	
	return router;
}