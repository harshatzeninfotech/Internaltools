import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Webcam from "react-webcam";

const videoConstraints = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  facingMode: "environment",
};

const CameraCaptureScreen = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { adspace, existingImages = [] } = state || {};

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const newImage = { uri: imageSrc, type: "image/jpeg" };
      navigate("/review-selected-images", {
        state: {
          capturedImages: [...existingImages, newImage],
          adspace,
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="w-full h-full object-cover"
        videoConstraints={videoConstraints}
      />

      {/* Controls overlay */}
      <div className="absolute bottom-6 w-full flex flex-col items-center px-4">
        <button
          onClick={capture}
          className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold mb-3"
        >
          📸 Capture
        </button>
        <button
          onClick={() => navigate(-1)}
          className="text-white text-sm underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CameraCaptureScreen;
