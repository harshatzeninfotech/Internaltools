// FullscreenCameraModal.jsx
import React, { useRef } from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";

const FullscreenCameraModal = ({ onClose, onCapture }) => {
  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "environment" }}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-10 flex gap-4">
        <button
          onClick={capture}
          className="bg-green-500 px-6 py-3 rounded text-white font-bold"
        >
          Capture
        </button>
        <button
          onClick={onClose}
          className="bg-gray-700 px-6 py-3 rounded text-white font-bold"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

export default FullscreenCameraModal;
