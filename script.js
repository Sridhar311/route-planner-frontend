document.addEventListener("DOMContentLoaded", () => {
  const startInput = document.getElementById("start");
  const goalInput = document.getElementById("goal");
  const findPathButton = document.getElementById("find-path");
  const pathResult = document.getElementById("path-result");

  // Initialize the map, now centered on Tamil Nadu
  const map = L.map("map").setView([11.1271, 78.6569], 7); // Centered at Tamil Nadu with zoom level 7

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Mapping of cities to lat/lng coordinates
  const cityCoordinates = {
    Chennai: [13.0827, 80.2707],
    Kanchipuram: [12.8343, 79.7071],
    Tiruvallur: [13.1454, 79.9781],
    Villupuram: [11.9333, 79.5000],
    Pondicherry: [11.9416, 79.8083],
    Cuddalore: [11.7462, 79.7807],
    Nagapattinam: [10.7574, 79.8432],
    Tiruvarur: [10.7312, 79.6124],
    Thanjavur: [10.7865, 79.1508],
    Pudukkottai: [10.3622, 78.6948],
    Sivaganga: [9.8627, 78.5214],
    Ramanathapuram: [9.3511, 78.7862],
    Rameshwaram: [9.2905, 79.3124],
    Thoothukudi: [8.8000, 78.1320],
    Tirunelveli: [8.7098, 77.7314],
    Kanyakumari: [8.0883, 77.5385],
    Trichy: [10.7905, 78.7040],
    Namakkal: [11.2803, 78.1460],
    Karur: [10.9621, 77.9227],
    Dindigul: [10.3641, 77.9797],
    Theni: [10.0093, 77.4912],
    Kambam: [9.9802, 77.4672],
    Idukki: [9.8597, 77.0835],
    Coimbatore: [11.0168, 76.9558],
    Madurai: [9.9197, 78.1197],
    Tiruppur: [11.0788, 77.3381],
    Erode: [11.3400, 77.7170],
    Salem: [11.6643, 78.1460],
    Dharmapuri: [12.1075, 77.8714],
    Krishnagiri: [12.5212, 77.9602],
    Tiruvannamalai: [12.2297, 79.0780],
  };

  const startMarker = L.marker([11.1271, 78.6569], { draggable: true }).addTo(map);
  const goalMarker = L.marker([11.2271, 78.7569], { draggable: true }).addTo(map);

  // Fetch the shortest path from the server
  findPathButton.addEventListener("click", async () => {
    const start = startInput.value;
    const goal = goalInput.value;

    if (!start || !goal) {
      alert("Please enter both start and end points.");
      return;
    }

    try {
      const response = await fetch("https://route-planner-backend2.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start, goal }),
      });

      const data = await response.json();
      if (data.path && data.path.length > 0) {
        pathResult.textContent = `Path: ${data.path.join(" → ")}, Distance: ${data.distance} KM`;

        // Fetch real lat/lng coordinates from the mapping
        const latLngs = data.path.map((node) => {
          if (cityCoordinates[node]) {
            return cityCoordinates[node];
          }
          // Fallback in case coordinates are missing for any city
          return [11.1271, 78.6569]; // Default to Tamil Nadu's center
        });

        startMarker.setLatLng(latLngs[0]);
        goalMarker.setLatLng(latLngs[latLngs.length - 1]);
        const polyline = L.polyline(latLngs, { color: "blue" }).addTo(map);

        map.fitBounds(polyline.getBounds());
      } else {
        pathResult.textContent = "No path Found";
      }
    } catch (error) {
      console.error("Error fetching shortest path:", error);
      alert("Failed to fetch shortest path. Check the server.");
    }
  });
});
