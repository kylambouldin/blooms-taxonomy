var mongoose 	= require('mongoose');
var Schema		= mongoose.Schema;

var Assignment = new Schema ({
	title: String,
	data: [],
	user: String,
	date: Date
})

mongoose.model('Assignment', Assignment);

/*
Database is called 'assignments'

When adding keys to this model update users controller
*/