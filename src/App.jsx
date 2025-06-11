// import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ToolsDasboard from "./components/ToolsDashboard";
import OverlayFeature from "./components/Overlay";
import OverlayOptions from "./components/OverlayOptions";
import ModifiedOverlay from "./components/ModifiedOverlay";
import HeatmapComponent from "./components/HeatMap";
import Video from "./components/Video";
import LoginPage from "./components/Runners/LoginPage";
import RunnerDashboard from "./components/Runners/RunnerDashboard";
import ReviewSelectedImages from "./components/Runners/ReviewCaptureImages";
import CameraCaptureScreen from "./components/Runners/Mod/CameraFullScreen";
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
          <Route path="/login-runner" element={<LoginPage />} />
          <Route path="/runner-dashboard" element={<RunnerDashboard />} />
          <Route path="/review-selected-images" element={<ReviewSelectedImages />} />
          <Route path="/camera" element={<CameraCaptureScreen />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
