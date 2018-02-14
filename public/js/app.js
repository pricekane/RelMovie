//On click of the save movie button, send the post request that will hit our route to save the movie to the database.  Reload when done as the button should switch to Unsave.
$(".save-movie").on("click", function(event) {
	event.preventDefault();
	//REFACTOR?? We are passing the entire movie object as a string here and will JSON it after the post since we can't send the object.
	var thisMovie = $(this).attr("data-id");
	var thisUserId = $(this).attr("data-user");
		$.ajax({
			method: "POST",
			url: "/save/",
			data: {
			movie: thisMovie,
			userId: thisUserId
			}
		}).done(window.location.reload(true));
	});

//Unsave post.  Unlike the above save post, we only are only passing the ID of the movie here.
$(".unsave-movie").on("click", function(event) {
	event.preventDefault();
	var thisMovieId = $(this).attr("data-id");
	var thisUserId = $(this).attr("data-user");
	// Run a POST request to unsave the movie, using what's entered in the inputs
	$.ajax({
	  method: "POST",
	  url: "/unsave/",
	  data: {
		movieId: thisMovieId,
		userId: thisUserId
	  }
	}).done(window.location.reload(true));
});
