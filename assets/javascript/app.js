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

// Array of favorites
var favorites = [];


// FUNCTIONS
// ===============================
function renderBtns(array) {
	for (var i = 0; i < array.length; i++) {
		var newBtn = $("<button>").text(array[i]);
		newBtn.addClass("animal-btn btn btn-info m-1").attr("data-name", array[i]);
		newBtn.appendTo("#button-div");
	};
};

function renderFavBtn(ref) {
	var favoritesBtn = $(`<button class="favorites btn btn-sm btn-success mb-2 ml-2 mr-2">Add to Favorites</button>`);
	favoritesBtn.attr("data-url", ref.data("url"));
	favoritesBtn.attr("data-rating", ref.data("rating"));
	favoritesBtn.attr("data-title", ref.data("title"));
	ref.parent().append(favoritesBtn);
};

function runQuery(queryURL) {
	// AJAX function
	$.ajax({
		url: queryURL,
		method: "GET"
	}).done(function (res) {
		console.log(queryURL);
		for (var i = 0; i < res.data.length; i++) {
			var gifSrc = res.data[i].images.fixed_height.url;
			var still = res.data[i].images.fixed_height_still.url;
			var animated = res.data[i].images.fixed_height.url;
			var gifDiv = $("<div>").addClass("float-left mt-2 mr-2 border border-dark rounded text-center");

			// Add <img> to hold gif
			var gif = $("<img>").attr("src", gifSrc);
			gif.addClass("gif");
			gif.attr("data-still", still);
			gif.attr("data-animate", animated);
			gif.attr("data-state", "animate");

			// Add download link
			var download = $("<a>");
			var downloadBtn = $("<button>").text("Download");
			downloadBtn.addClass("btn btn-sm btn-secondary mb-2 mr-2 ml-2");
			download.attr("href", gifSrc);
			download.attr("download", true);
			download.attr("target", "_blank");
			download.html(downloadBtn);

			// Add favorites button
			var favoritesBtn = $(`<button class="favorites btn btn-sm btn-success mb-2 ml-2 mr-2">Add to Favorites</button>`);
			favoritesBtn.attr("data-url", gifSrc);
			favoritesBtn.attr("data-rating", res.data[i].rating);
			favoritesBtn.attr("data-title", res.data[i].title);
			favoritesBtn.attr("data-still", still);
			favoritesBtn.attr("data-animate", animated);
			favoritesBtn.attr("data-state", "animate");

			var rating = $("<p>").text(`Rating: ${res.data[i].rating}`);
			var title = $(`<p class="m-1"><strong>${res.data[i].title}</strong></p>`);
			$("#get-more").html(`<span>Get More Gifs!</span>`)

			gifDiv.append(title, gif, rating, download, favoritesBtn);
			$("#giphy-div").append(gifDiv);
		};
	});
};

function addGifToFav(ref) {
	$("#show-favs").css("display", "block");
	var index = favorites.indexOf(ref.data("url"));
	ref.parent().remove();

	if (index > -1) {
		return false;
	} else {
		favorites.push(ref.data("url"));

		var gifDiv = $("<div>").addClass("float-left mt-2 mr-2 border rounded text-center");
		var gif = $("<img>").attr("src", ref.data("url")).addClass("gif").attr("data-still", ref.data("still")).attr("data-animate", ref.data("animate"));

		var rating = $("<p>").text(`Rating: ${ref.data("rating")}`);
		var title = $(`<p class="m-1"><strong>${ref.data("title")}</strong></p>`);
		var downloadBtn = (`<a href="${ref.data("url")}"><button class="btn btn-sm btn-secondary mb-2 mr-2 ml-2" target="_blank" download>Download</button></a>`);
		var removeBtn = $("<button>").addClass("remove btn btn-sm btn-danger mb-2 mr-2 ml-2").text("Remove").attr("data-url", ref.data("url")).attr("data-rating", ref.data("rating")).attr("data-title", ref.data("title"));

		gifDiv.append(title, gif, rating, downloadBtn, removeBtn);

		$("#favorites").append(gifDiv);

		localStorage.setItem("url", ref.data("url"));
		localStorage.setItem("url-still", ref.data("url"));
		localStorage.setItem("url-animate", ref.data("animate"));
	};
};

function generateURL() {
	$("#get-more").css("display", "block");
	$("#giphy-div").empty();
	queryTerm = ($(this).data("name"));
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
$(document).ready(function () {

	// Show current list of topics
	renderBtns(topics);

	// Generate gifs
	$(document).on("click", ".animal-btn", generateURL);

	// Pause and animate gifs
	$(document).on("click", ".gif", function () {
		var state = $(this).attr("data-state");

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
		addGifToFav($(this));
		console.log(this);
	});

	// Show favorites
	$(document).on("click", "#show-favs", function () {
		$("#hidden-favs").css("display", "block");
		$("#main-gif-display").css("display", "none");
		$(this).css("display", "none");
		var backBtn = $("<button>").addClass("go-back btn btn-dark").text("Go Back");
		$("body").prepend(backBtn);
	});

	// Remove gif from favorites
	$(document).on("click", ".remove", function () {
		favorites.splice($(this).data("url"));
		renderFavBtn($(this));
		$("#giphy-div").prepend($(this).parent());
		$(this).remove();
	});

	// Back to main page
	$(document).on("click", ".go-back", function () {
		$("#main-gif-display").css("display", "block");
		$("#hidden-favs").css("display", "none");
		$(this).css("display", "none");
		$("#show-favs").css("display", "block");
	});

	// Get more results
	$("#get-more").on("click", function () {
		$("#giphy-div").empty();
		numResults += 10;
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
			var btnText = $("#new-item").val().toLowerCase();
			btnText = capitalizeFirstLetter(btnText);
			var newBtn = $("<button>").text(btnText).addClass("animal-btn btn btn-info m-1").attr("data-name", btnText).appendTo("#button-div");
			$("#new-item").val("");
		};
	});
});