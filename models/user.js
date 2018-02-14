var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    username: String,
	password: String,
	savedMovie: [{
		type: Schema.Types.ObjectId,
		ref: "Movie"
	  }]
	});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);