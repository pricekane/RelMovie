var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var MovieSchema = new Schema({
 movies: { 
  type: Array,
  default: [],
},
user: {
  type: String,
  required: true,
}
});

// This creates our model from the above schema, using mongoose's model method
var Movie = mongoose.model("Movie", MovieSchema);

// Export the Movie model
module.exports = Movie;