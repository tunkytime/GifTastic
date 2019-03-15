
// SETUP VARIABLES
// ===============================

	// Giphy.com API Key
	const apiKey = "c8EePyYMnKwgZ1eXaeZeU7CJBRDwas75";
	
	// Search parameters
	var queryTerm = "";
	var numResults = 10;

	// queryURL for Giphy API
	var queryURLBase = "https://api.giphy.com/v1/gifs/search?&limit=" + numResults + "&api_key=" + apiKey;

	// Array of topics
	var topics = ["Dog", "Cat", "Mouse", "Bunny", "Bird"];


// FUNCTIONS
// ===============================

	function renderBtns (array) {
		for (var i = 0; i < array.length; i++) {
			var newBtn = $("<button>").text(array[i]);
			newBtn.addClass("animal-btn btn btn-primary m-1").attr("data-name", array[i]);
			newBtn.appendTo("#button-div");
		};
	};

	function runQuery (queryURL) {
		// AJAX function
		$.ajax({
		url: queryURL,
		method: "GET"
		}).done(function (res) {
			console.log(queryURL);
			for (var i = 0; i < res.data.length; i++) {
				
				// Add <div> to hold elements
				var gifDiv = $("<div>");
				gifDiv.addClass("float-left mt-2 mr-2 border rounded text-center");
				
				// Add download link
				var download= $("<a>");
				download.attr("href", res.data[i].images.original.url);
				console.log(res.data[i].url);
				download.attr("download", true);
				download.attr("target", "_blank");
				var downloadBtn = (`<button class="btn btn-sm btn-secondary mb-2 mr-2 ml-2">Download</button>`);
				download.html(downloadBtn);
				
				// Add favorites button
				var favorites = $(`<button class="favorites btn btn-sm btn-primary mb-2 ml-2 mr-2">Add to Favorites</button>`);
				favorites.attr("data-url", res.data[i].images.fixed_height.url);

				// Add <img> to hold gif
				var gif = $("<img>").attr("src", res.data[i].images.fixed_height.url);
				gif.attr("data-still", res.data[i].images.fixed_height_still.url);
				gif.attr("data-animate", res.data[i].images.fixed_height.url);
				gif.attr("data-state", "animate");
				gif.addClass("gif");
				
				// Add <p> to hold rating
				var rating = $("<p>").text(`Rating: ${res.data[i].rating}`);
				
				// Add <p> to hold title
				var title = $(`<p class="m-1"><strong>${res.data[i].title}</strong></p>`);
				
				// Append elements
				$("#get-more").html(`<span>Get More Gifs!</span>`)
				gifDiv.append(title);
				gifDiv.append(gif);
				gifDiv.append(rating);
				gifDiv.append(download);
				gifDiv.append(favorites);
				$("#giphy-div").append(gifDiv);
			};
		});
	};

	function generateURL () {
		// Clear the div
		$("#get-more").css("display", "block");
		$("#giphy-div").empty();
		
		// Get query term
		queryTerm = ($(this).data("name"));
		
		// Add the search term and number of results to base URL
		var newURL = queryURLBase + "&q=" + queryTerm;
				
		// Send AJAX call the new URL
		runQuery(newURL);
	};
	
	// Capitalize first letter
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

// MAIN PROCESS
// ===============================

$( document ).ready(function() {

	renderBtns(topics);
	
	// $(document).on("click")... for dynamically generated elements
	
	// Generate gifs
	$(document).on("click", ".animal-btn", generateURL);
		
	// Pause/animate gifs
	$(document).on("click", ".gif", function () {
		// Get current state
		var state = $(this).attr("data-state");

		// Update state when clicked
		if (state === "animate") {
			$(this).attr("src", $(this).attr("data-still"));
			$(this).attr("data-state", "still");
		} else {
			$(this).attr("src", $(this).attr("data-animate"));
			$(this).attr("data-state", "animate");
		};
	});
	
	// Add gif to favorites
	$(document).on("click", ".favorites", function () {
		console.log($(this).data("url"));
	});
	
	// Get more results
	$("#get-more").on("click", function () {				
		// Get the number of results
		numResults += 10;
		
		// Add the search term and number of results to base URL
		var newURL = queryURLBase + "&q=" + queryTerm + "&limit=" + numResults;
		
		// Send AJAX call the new URL
		runQuery(newURL);
	});
	
	// Grab value from input box and append to #button-div
	$("#add-item").on("click", function () {
		event.preventDefault();
		
		if ($("#new-item").val() === "") {
			return false;
			
		} else {
			var newBtn = $("<button>")
			var btnText = $("#new-item").val();
			
			// Convert to all lower case and capitalize first letter
			btnText = btnText.toLowerCase();
			btnText = capitalizeFirstLetter(btnText);

			newBtn.text(btnText);
			newBtn.addClass("animal-btn btn btn-primary m-1").attr("data-name", btnText);
			newBtn.appendTo("#button-div");
			
			topics.push(name);
			
			// Clear input box
			$("#new-item").val("");
		};
	});
});

