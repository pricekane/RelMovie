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
    
    app.get('/details/:id', function (req, res) {
    
    const theUser = req.user;
    const movieId = req.params.id;
    const api_key = "a9ece44e8732dfb9e826500dbed166b2"
    
    request({
        "url": "https://api.themoviedb.org/3/movie/"+movieId+"?api_key="+api_key+"&language=en-US",
        "method": "GET",
    }, function(err, response, body) {
            let json = JSON.parse(body);
            console.log(json);
            console.log(theUser);
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
    

    app.get("/saved", function(req, res) {
        if (req.user !== undefined) {
        db.User.findById(req.user._id, function (err, doc){
            if (err) throw err;
            if (! doc) return res.send(401);
            res.render("saved", {
                user: doc
            });          
        });        // ..and populate all of the comments associated with it
        }
        else {
            res.render("saved");
        }
    })


    app.post("/save/", function(req, res) {
        var movieObject = JSON.parse(req.body.movie);
        db.User.findOneAndUpdate({ _id: req.body.userId }, {$addToSet: {savedMovie: movieObject}}, { new: true }, function(err, data) {
                if(err) {
                  return res.status(500).json({'error' : 'error in adding movie'});
                }
                res.json(data);
              });
            });

    app.post("/unsave/", function(req, res) {
        var movieInt = parseInt(req.body.movieId);
        console.log(req.body);
        db.User.findOneAndUpdate({_id: req.body.userId}, {$pull: {savedMovie: {id: movieInt}}}, function(err, data) {
            if(err) {
                return res.status(500).json({'error' : 'error in removing movie'});
              }
              console.log((data));
            });
          });
    
    app.get('/register', function(req, res) {
        res.render('register', { });
    });
    
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

    // app.post('/login', passport.authenticate('local'), function(req, res) {
    //     res.redirect('/');
    // });
    
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // app.get("*", function(req, res) {
    //     res.render("home");
    // });
};
