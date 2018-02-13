var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var MovieSchema = new Schema({
  poster: {
    type: String,
  },
  title: {
	type: String,
    required: true 
  },
  overview: {
	type: String,
  },
  genres: {
    type: Array,
  },
  reviews: {
    type: Number,
  },
  runtime: {
    type: Number,
  },
  release_date: {
    type: String,
  },
  imdb_id: {
    type: String
  },
  saved: {
	type: Boolean,
	default: 0
  },
  imdb_id: {
    type: Number,
    unique: true
  }
});

// This creates our model from the above schema, using mongoose's model method
var Movie = mongoose.model("Movie", MovieSchema);

// Export the Movie model
module.exports = Movie;