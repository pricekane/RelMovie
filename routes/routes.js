var express = require('express');
var request = require('request'); // for web-scraping
var cheerio = require('cheerio'); // for web-scraping
var db = require("../models");
var mongoose = require("mongoose");

handleError = (err) => {
  console.log("Got an error", err)
};

module.exports = function (app) {

    app.get('/', function (req, res) {
     res.render("home");
    });

    app.get('/search/:id', function (req, res) {
    
    const movieTitle = req.params.id;
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
            console.log(json);
            res.render("details", {movie: json});
        });
        });
    

    app.get("/saved", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.find({saved: 1})
        // ..and populate all of the comments associated with it
        .then(function(dbArticles) {
            console.log(dbArticles + "saved!");
            res.render("saved", {articles: dbArticles})
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

    app.get("*", function(req, res) {
        res.render("home");
    });
};
