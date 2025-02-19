// Initialize Leaflet map with no base layer
var map = L.map('map', {
    crs: L.CRS.Simple, // Using a flat coordinate system
    minZoom: 2, // Prevent extreme zooming out
    maxZoom: 10, // Prevent extreme zooming in
});

var bounds = [[-70, -70], [70, 70]]; // Your custom bounds
map.fitBounds(bounds);
map.setMaxBounds(bounds); // Restrict movement beyond bounds


// Define the pixel size of one unit on the map
var pixel_length = 2 / 400;  // Size of one pixel in the map

// Load CSV file
Papa.parse("data/final_locations.csv", {
    download: true,
    header: true,
    complete: function(results) {
        results.data.forEach(game => {
            if (!game.x || !game.y || !game.image_path) return; // Skip invalid rows

            var x = parseFloat(game.x);
            var y = parseFloat(game.y);
            var w = parseFloat(game.w) * pixel_length;  // Scale width by pixel_length
            var h = parseFloat(game.h) * pixel_length;  // Scale height by pixel_length
            var imageUrl = game.image_path;

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
