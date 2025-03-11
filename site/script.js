// Initialize Leaflet map with no base layer
var map = L.map('map', {
    crs: L.CRS.Simple, // Using a flat coordinate system
    minZoom: 2, // Prevent extreme zooming out
    maxZoom: 10, // Prevent extreme zooming in
});

var bounds = [[-80, -80], [80, 80]]; // Your custom bounds
map.fitBounds(bounds);
map.setMaxBounds(bounds); // Restrict movement beyond bounds

// Define the pixel size of one unit on the map
var pixel_length = 1.25 / 400;  // Size of one pixel in the map

var gameLocations = {}; // Store game locations by title
var gameTitles = []; // Store game titles for autocomplete

// Load CSV file
Papa.parse("data/final_locations.csv", {
    download: true,
    header: true,
    complete: function(results) {
        results.data.forEach(game => {
            if (!game.x || !game.y || !game.image_path || !game.title) return; // Skip invalid rows

            var x = parseFloat(game.x);
            var y = parseFloat(game.y);
            var w = parseFloat(game.w) * pixel_length;  // Scale width by pixel_length
            var h = parseFloat(game.h) * pixel_length;  // Scale height by pixel_length
            var imageUrl = game.image_path;
            var title = game.title;

            // Store game location for search functionality
            gameLocations[title.toLowerCase()] = { x, y };
            gameTitles.push(title);

            // Define image bounds (scaling factor may need adjustment)
            var imageBounds = [
                [y - h / 2, x - w / 2],  // Bottom-left
                [y + h / 2, x + w / 2]   // Top-right
            ];

            // Add image overlay
            L.imageOverlay(imageUrl, imageBounds).addTo(map);
        });
    },
    error: function(error) {
        console.error("Error loading CSV:", error);
    }
});

// Create search bar
var searchContainer = L.control({ position: 'topleft' }); // Move next to zoom controls
searchContainer.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'search-container');
    div.innerHTML = '<input id="searchBox" type="text" placeholder="Search for a game..." list="gameSuggestions" />';
    div.style.padding = '5px';
    div.style.background = 'white';
    div.style.borderRadius = '5px';
    div.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
    div.innerHTML += '<datalist id="gameSuggestions"></datalist>';
    return div;
};
searchContainer.addTo(map);

// Populate search suggestions
function updateSearchSuggestions() {
    var datalist = document.getElementById("gameSuggestions");
    datalist.innerHTML = "";
    gameTitles.forEach(title => {
        var option = document.createElement("option");
        option.value = title;
        datalist.appendChild(option);
    });
}

// Update suggestions after CSV loads
setTimeout(updateSearchSuggestions, 2000);

// Search function
document.getElementById('searchBox').addEventListener('input', function(event) {
    var searchTerm = event.target.value.toLowerCase();
    if (gameLocations[searchTerm]) {
        var { x, y } = gameLocations[searchTerm];
        map.setView([y, x], 8); // Immediately move on selection
    }
});
