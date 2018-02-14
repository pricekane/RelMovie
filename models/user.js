var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    username: {
		type: String,
		unique: true,
	},
	password: String,
	savedMovie: {
		type: Array,
		default: [],
	  }
	});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);