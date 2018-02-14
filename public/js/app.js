$(".save-movie").on("click", function(event) {
	event.preventDefault();
	var thisId = $(this).attr("data-id");
		$.ajax({
			method: "POST",
			url: "/save/",
			data: {
			id: thisId
			}
		}).done(window.location.reload(true));
	});
  
$(".unsave-movie").on("click", function(event) {
	event.preventDefault();
	var thisId = $(this).attr("data-id");
  
	// Run a POST request to unsave the movie, using what's entered in the inputs
	$.ajax({
	  method: "POST",
	  url: "/unsave/",
	  data: {
		id: thisId
	  }
	}).done(window.location.reload(true));
	
});
