
// SETUP VARIABLES
// ===============================

	// Giphy.com API Key
	const apiKey = "c8EePyYMnKwgZ1eXaeZeU7CJBRDwas75";

	// queryURL for Giphy API
	var queryURLBase = "https://api.giphy.com/v1/gifs/search?limit=10&api_key=" + apiKey;

	// Search parameters
	var queryTerm = "";

	// Array of animals
	var animals = ["Dog", "Cat", "Mouse", "Bunny", "Bird"];


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
				var newGif = $("<img>").attr("src", res.data[i].images.fixed_height.url);
				newGif.attr("data-still", res.data[i].images.fixed_height_still.url);
				newGif.attr("data-animate", res.data[i].images.fixed_height.url);
				newGif.attr("data-state", "animate");
				newGif.addClass("gif");
				newGif.appendTo("#giphy-div");
			};
		});
	};

	function generateURL () {
		// Clear the div
		$("#giphy-div").empty();
		
		// Get query term
		queryTerm = ($(this).data("name"));
		
		// Add the search term to base URL
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

	renderBtns(animals);
	
	$(document).on("click", ".animal-btn", generateURL);
		
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
	
	// Grab value from input box and append to #button-div
	$(document).on("click", "#add-item", function () {
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
			
			animals.push(name);
			
			// Clear input box
			$("#new-item").val("");
		};
	});
});

