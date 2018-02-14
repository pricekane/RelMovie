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
     res.render("home");
    });

    app.get('/search/', function (req, res) {
    
    const movieTitle = req.query.id;
	const api_key = "a9ece44e8732dfb9e826500dbed166b2"
	
	request({
		"url": "https://api.themoviedb.org/3/search/movie?api_key="+api_key+"&query="+movieTitle,
		"method": "GET",
    }, function(err, response, body) {
            let json = JSON.parse(body);
            console.log(json);
            res.render("search", {movies: json.results});
    });
    });
    
    app.get('/details/:id', function (req, res) {
    
    const movieId = req.params.id;
    const api_key = "a9ece44e8732dfb9e826500dbed166b2"
    
    request({
        "url": "https://api.themoviedb.org/3/movie/"+movieId+"?api_key="+api_key+"&language=en-US",
        "method": "GET",
    }, function(err, response, body) {
            let json = JSON.parse(body);
            res.render("details", {movie: json});
        });
        });
    

    app.get("/saved", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Movie.find({})
        // ..and populate all of the comments associated with it
        .then(function(response) {
            console.log(response + "are your movies!");
            res.render("saved", {moviesDB: response})
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

    app.post("/save/", function(req, res) {
        console.log(req.body.movie);
        db.Movie.update({id: req.body.id});
        newMovie.save(function (err) {
          if (err) return handleError(err);
        });
    });

    app.post("/unsave/:id", function(req, res) {
        console.log(req.body);
        var removeMovie = new db.Movie({id: req.body.id});
        removeMovie.remove(function (err) {
          if (err) return handleError(err);
        });
    });

    app.get("/login", function(req, res){
        res.render("login");
    });

    app.post("/login",
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true })
);

    

    // app.get("*", function(req, res) {
    //     res.render("home");
    // });
};
