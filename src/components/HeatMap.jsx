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
              obj[headers[index]] = value.trim();
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

        const heatmapData = data
          .filter((row) => row[latKey] && row[lngKey])
          .map((row) => {
            const lat = parseFloat(row[latKey].replace(",", "."));
            const lng = parseFloat(row[lngKey].replace(",", "."));
            return !isNaN(lat) && !isNaN(lng)
              ? new window.google.maps.LatLng(lat, lng)
              : null;
          })
          .filter((point) => point !== null);

        if (heatmapData.length === 0) {
          setError("No valid geographic points found");
          return;
        }

        if (heatmap) {
          heatmap.setMap(null);
        }

        const newHeatmap = new window.google.maps.visualization.HeatmapLayer({
          data: heatmapData,
          map: map,
          radius: 20,
        });

        setHeatmap(newHeatmap);
        setError("");

        // Adjust map bounds
        const bounds = new window.google.maps.LatLngBounds();
        heatmapData.forEach((point) => bounds.extend(point));
        map.fitBounds(bounds);
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  const mapOptions = {
    mapTypeId: "hybrid", // Options: "roadmap", "satellite", "hybrid", "terrain"
    streetViewControl: true, // Enable Street View
    mapTypeControl: true, // Enable switching between map types
    fullscreenControl: true, // Enable fullscreen button
    zoomControl: true, // Enable zoom buttons
    tilt: 45, // Tilt for 3D buildings
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
        {/* <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={{ lat: 37.774546, lng: -122.433523 }}
          zoom={13}
          onLoad={(map) => setMap(map)}
          options={{
            mapTypeId: "roadmap",
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        /> */}
        <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={{ lat: 37.774546, lng: -122.433523 }}
          zoom={13}
          options={mapOptions} // Apply custom options
          onLoad={(map) => setMap(map)}
        />
      </div>
    </div>
  );
};

export default HeatmapComponent;
