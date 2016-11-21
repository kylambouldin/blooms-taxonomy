var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var UserSchema = new Schema ({
	username: String,
	password: String,
	type: String,
	assignments: [], // student=completed, teacher=required
	created_at: Date
})

// eventually have a student model and teacher model??

mongoose.model('User', UserSchema);

/*
Database is called 'users'

When adding keys to this model update passport/signup.js
*/