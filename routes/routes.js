var express = require('express');
var request = require('request'); // for web-scraping
var db = require("../models");
var mongoose = require("mongoose");
var passport= require("passport");

handleError = (err) => {
  console.log("Got an error", err)
};

module.exports = function (app) {

    app.get('/', function (req, res) {
     res.render("home", {user: req.user});
    });

    app.get('/search/', function (req, res) {
    
    const movieTitle = req.query.id;
	const api_key = "a9ece44e8732dfb9e826500dbed166b2"
	// Call the movie database using our title and render the search page while passing in the JSON results and user information
	request({
		"url": "https://api.themoviedb.org/3/search/movie?api_key="+api_key+"&query="+movieTitle,
		"method": "GET",
    }, function(err, response, body) {
            let json = JSON.parse(body);
            res.render("search", {
                user: req.user,
                movies: json.results
            });
    });
    });
    
    // This should be accessed from the saved page or search page.  The API needs a more detailed call using movie ID to make the request, which is attached to the poster and card divs that have the call listeners.
    app.get('/details/:id', function (req, res) {
    
    const theUser = req.user;
    const movieId = req.params.id;
    const api_key = "a9ece44e8732dfb9e826500dbed166b2"
    
    request({
        "url": "https://api.themoviedb.org/3/movie/"+movieId+"?api_key="+api_key+"&language=en-US",
        "method": "GET",
    }, function(err, response, body) {
            let json = JSON.parse(body);
            //I want to show the save OR remove button based on the movie we are requesting depending on if the user has the movie saved.  Since we have the user object, we can loop through the users saved movies and make sure that they do not contain the ID of the movie we just pulled.  Since Handlebars #if helper only checks for true values, we need to use the notFound format.
            var notFound = true;
            if (theUser !== undefined) {
                for(var i = 0; i < theUser.savedMovie.length; i++) {
                    if (req.user.savedMovie[i].id === json.id) {
                        notFound = false;
                        break;
                    }
                }
            }            
            res.render("details", {
                user: req.user,
                movie: json,
                movieString: JSON.stringify(json),
                notFound: notFound,
            });
        });
        });
    
    //Pull the user's movies and pass to the saved page for rendering.  If no user, don't make the call and don't pass user which will modify the html through a Handlebars if statement
    app.get("/saved", function(req, res) {
        if (req.user !== undefined) {
        db.User.findById(req.user._id, function (err, doc){
            if (err) throw err;
            if (! doc) return res.send(401);
            res.render("saved", {
                user: doc
            });          
        });
        }
        else {
            res.render("saved");
        }
    })

    //Save the movie to the database on button press.  addToSet keeps duplicates from being stores.  We passed the JSON as a string so we have to parse it first.
    app.post("/save/", function(req, res) {
        var movieObject = JSON.parse(req.body.movie);
        db.User.findOneAndUpdate({ _id: req.body.userId }, {$addToSet: {savedMovie: movieObject}}, { new: true }, function(err, data) {
                if(err) {
                  return res.status(500).json({'error' : 'error in adding movie'});
                }
                res.json(data);
              });
            });
    //Remove the movie from the use.  Our movie ID was passed as an integer so we have to parse it first.
    app.post("/unsave/", function(req, res) {
        var movieInt = parseInt(req.body.movieId);
        db.User.findOneAndUpdate({_id: req.body.userId}, {$pull: {savedMovie: {id: movieInt}}}, function(err, data) {
            if(err) {
                return res.status(500).json({'error' : 'error in removing movie'});
              }
            });
          });
    
    app.get('/register', function(req, res) {
        res.render('register', { });
    });
    //register is built in passport functionality that allows us to register our user.  If we get and error, pass an error object to the register page for use in Handlebars HTML
    app.post('/register', function(req, res) {
        db.User.register(new db.User({ username : req.body.username }), req.body.password, function(err, user) {
            if (err) {
                return res.render('register', { error : "user" });
            }
    
            passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            });
        });
    });
    
    app.get('/login', function(req, res) {
        res.render('login', { user : req.user });
    });
    
    //Passport log-in boilerplate
    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
          if (err) {
            return next(err); // will generate a 500 error
          }
          // Generate a JSON response reflecting authentication status
          if (! user) {
            return res.render('login', {error: "error"});;
          }
          req.login(user, function(err){
            if(err){
              return next(err);
            }
            return res.redirect('/');;        
          });
        })(req, res, next);
      });
    
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};
