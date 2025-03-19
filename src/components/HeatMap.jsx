import { useState, useEffect, useRef } from "react";
import { useLoadScript, GoogleMap } from "@react-google-maps/api";
import * as Papa from "papaparse";
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const HeatmapComponent = () => {
  const [map, setMap] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["visualization"],
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    Papa.parse(file, {
      complete: (results) => {
        const rows = results.data;
        if (rows.length === 0) {
          setError("CSV file is empty");
          return;
        }
  
        const headers = rows[0].map((h) => h.trim());
        const data = rows.slice(1).map((row) => {
          const obj = {};
          row.forEach((value, index) => {
            if (index < headers.length) {
              obj[headers[index]] = value.toString().trim(); // Ensure string
            }
          });
          return obj;
        });
  
        const latKey = headers.find((h) => h.toLowerCase().includes("lat"));
        const lngKey = headers.find((h) => h.toLowerCase().includes("lon"));
  
        if (!latKey || !lngKey) {
          setError("Latitude/Longitude headers not found in CSV");
          return;
        }
  
        // Parse coordinates and filter invalid points
        const heatmapData = data
          .map((row) => {
            const latStr = row[latKey].replace(",", ".");
            const lngStr = row[lngKey].replace(",", ".");
            const lat = parseFloat(latStr);
            const lng = parseFloat(lngStr);
            if (isNaN(lat) || isNaN(lng)) {
              console.warn("Invalid coordinates:", row[latKey], row[lngKey]);
              return null;
            }
            return new window.google.maps.LatLng(lat, lng);
          })
          .filter((point) => point !== null);
  
        if (heatmapData.length === 0) {
          setError("No valid coordinates found in CSV");
          return;
        }
  
        if (!map) {
          setError("Map not loaded. Try again.");
          return;
        }
  
        // Clear existing heatmap
        if (heatmap) heatmap.setMap(null);
  
        // Add new heatmap
        const newHeatmap = new window.google.maps.visualization.HeatmapLayer({
          data: heatmapData,
          map: map,
          radius: 20,
        });
        setHeatmap(newHeatmap);
  
        // Adjust map view to show all points
        const bounds = new window.google.maps.LatLngBounds();
        heatmapData.forEach((point) => bounds.extend(point));
        map.fitBounds(bounds); // Zooms to include all points
  
        // Optional: Center on the first point
        // map.setCenter(heatmapData[0]);
        // map.setZoom(14);
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  const mapOptions = {
    mapTypeId: "hybrid",
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
    zoomControl: true,
    tilt: 45,
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="mb-4">
        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload CSV File
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <div className="flex-1 rounded-lg overflow-hidden shadow-lg">
        <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={{ lat: 18.5152416229248, lng: 73.8504028320313 }}
          zoom={13}
          options={mapOptions}
          onLoad={(map) => setMap(map)}
        />
      </div>
    </div>
  );
};

export default HeatmapComponent;