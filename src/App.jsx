// import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ToolsDasboard from "./components/ToolsDashboard";
import OverlayFeature from "./components/Overlay";
import OverlayOptions from "./components/OverlayOptions";
import ModifiedOverlay from "./components/ModifiedOverlay";
import HeatmapComponent from "./components/HeatMap";
import Video from "./components/Video";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<ToolsDasboard />} />
          <Route path="/overlay" element={<OverlayFeature />} />
          <Route path="/OverlayOptions" element={<OverlayOptions />} />
          <Route path="/ModifiedOverlay" element={<ModifiedOverlay />} />
          <Route path="/HeatmapComponent" element={<HeatmapComponent />} />
          <Route path="/video" element={<Video />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
