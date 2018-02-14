//Lots of packages required here for express, handlebars, passport, mongoose combination
var express = require("express");
var exphbs  = require('express-handlebars');
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var path = require("path");
var request = require('request');
var MongoClient = require('mongodb').MongoClient;


//Get all of our models so we can call them later under db.
var db = require("./models");

//If we're not deployed, use 3000
var PORT = process.env.PORT || 3000;
// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Boilerplate for session tracking
app.use(require('express-session')({
  secret: 'wow cool moves',
  resave: false,
  saveUninitialized: false
}));

//Initialize passport boilerplate and setting our static directory
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new LocalStrategy(db.User.authenticate()));
passport.serializeUser(db.User.serializeUser());
passport.deserializeUser(db.User.deserializeUser());

// If deployed, use the deployed database. Otherwise use the local Movies database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Movies";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//Set our handlebars layout and add helpers
var hbs = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.  Did not create this myself.
  helpers: {
    grouped_each: function(every, context, options) {
      var out = "", subcontext = [], i;
      if (context && context.length > 0) {
          for (i = 0; i < context.length; i++) {
              if (i > 0 && i % every === 0) {
                  out += options.fn(subcontext);
                  subcontext = [];
              }
              subcontext.push(context[i]);
          }
          out += options.fn(subcontext);
      }
      return out;
    }
  }
});
//Further handlebars boilerplate
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
//Require our routes
require('./routes/routes.js')(app);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
