var express = require("express");
var exphbs  = require('express-handlebars');
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var session = require("express-session");


// Our scraping tools
// Request is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var request = require('request');

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory

app.use(express.static("public"));
app.use(session({ 
  secret: "cats",
  resave: false,
  saveUninitialized: true
 }));
app.use(passport.initialize());
app.use(passport.session());

var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Movies";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var hbs = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
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

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

require('./routes/routes.js')(app);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});