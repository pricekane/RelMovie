$(".save-movie").on("click", function(event) {
	event.preventDefault();
	var thisMovie = $(this).attr("data-id");
	console.log(thisMovie, "this is the movie string before being sent to the route")
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
  
$(".unsave-movie").on("click", function(event) {
	event.preventDefault();
	var thisId = $(this).attr("data-id");
	var thisUserId = $(this).attr("data-user");
	// Run a POST request to unsave the movie, using what's entered in the inputs
	$.ajax({
	  method: "POST",
	  url: "/unsave/",
	  data: {
		id: thisId,
		userId: thisUserId
	  }
	}).done(window.location.reload(true));
	
});
