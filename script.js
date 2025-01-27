document.addEventListener("DOMContentLoaded", () => {
  const startInput = document.getElementById("start");
  const goalInput = document.getElementById("goal");
  const findPathButton = document.getElementById("find-path");
  const pathResult = document.getElementById("path-result");

  // Initialize the map
  const map = L.map("map").setView([51.505, -0.09], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  const startMarker = L.marker([51.505, -0.09], { draggable: true }).addTo(map);
  const goalMarker = L.marker([51.515, -0.1], { draggable: true }).addTo(map);

  // Fetch the shortest path from the server
  findPathButton.addEventListener("click", async () => {
    const start = startInput.value;
    const goal = goalInput.value;

    if (!start || !goal) {
      alert("Please enter both start and end points.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start, goal }),
      });

      const data = await response.json();
      if (data.path && data.path.length > 0) {
        pathResult.textContent = `Path: ${data.path.join(" → ")}, Distance: ${data.distance} KM`;

        // Update markers and draw the path
        const latLngs = data.path.map((node, index) => {
          // For simplicity, generate random lat/lng for demo
          const offset = index * 0.01;
          return [51.505 + offset, -0.09 + offset];
        });

        startMarker.setLatLng(latLngs[0]);
        goalMarker.setLatLng(latLngs[latLngs.length - 1]);
        const polyline = L.polyline(latLngs, { color: "blue" }).addTo(map);

        map.fitBounds(polyline.getBounds());
      } else {
        pathResult.textContent = "No path found.";
      }
    } catch (error) {
      console.error("Error fetching shortest path:", error);
      alert("Failed to fetch shortest path. Check the server.");
    }
  });
});
