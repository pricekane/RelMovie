$(".save-movie").on("click", function(event) {
	event.preventDefault();
	var thisId = $(this).attr("data-id");
  
	// Run a POST request to save the movie, using what's entered in the inputs
	$.ajax({
	  method: "POST",
	  url: "/save/" + thisId,
	  data: {
		id: thisId
	  }
	}).done(window.location.reload(true));
});

$(".unsave-link").on("click", function(event) {
	event.preventDefault();
	var thisId = $(this).attr("data-id");
  
	// Run a POST request to unsave the movie, using what's entered in the inputs
	$.ajax({
	  method: "POST",
	  url: "/unsave/" + thisId,
	  data: {
		id: thisId
	  }
	}).done(window.location.reload(true));
	
});
