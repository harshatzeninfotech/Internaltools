import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const ReviewSelectedImages = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { capturedImages, adspace } = state || {};

  const [images, setImages] = useState(capturedImages || []);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // ← NEW
  const fileInputRef = useRef(); // ← NEW

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  };

const handleUpload = async () => {
  setIsUploading(true);
  const token = localStorage.getItem("access");
  const formData = new FormData();
  formData.append("ad_space", adspace.space_id);

for (let i = 0; i < images.length; i++) {
  let blob;
  if (images[i].uri.startsWith("data:")) {
    blob = dataURLtoBlob(images[i].uri);
  } else {
    const response = await fetch(images[i].uri);
    blob = await response.blob();
  }
  formData.append("images", blob, `captured_${i}.jpg`);
}

  try {
    const response = await axios.post(
      "https://zen-infotech.org/adspaces/runner/upload-verification-image/",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    alert("Success: " + response.data.message);
    navigate("/runner-dashboard"); // 👈 Redirect here
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Failed to upload images.");
  } finally {
    setIsUploading(false);
  }
};


  const handleLongPress = (index) => {
    setSelectedIndex(index);
    setShowDelete(true);
  };

  const deleteImage = () => {
    if (selectedIndex !== null) {
      const updated = images.filter((_, i) => i !== selectedIndex);
      setImages(updated);
      setSelectedIndex(null);
      setShowDelete(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      uri: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <div className="loader mb-4" />
            <p className="text-white font-semibold">Uploading...</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          Back
        </button>
        <button
          onClick={handleUpload}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Upload
        </button>
      </div>

      <h2 className="text-lg mb-4">
        {adspace?.title} - {images.length} Images
      </h2>

      <div className="grid grid-cols-3 gap-2">
        {images.map((img, index) => (
          <motion.div
            layout
            key={index}
            onContextMenu={(e) => {
              e.preventDefault();
              handleLongPress(index);
            }}
            className="relative"
          >
            <img
              src={img.uri}
              alt="Preview"
              className="w-full h-32 object-cover rounded"
            />
          </motion.div>
        ))}

        <motion.div
          layout
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center bg-gray-700 text-white rounded h-32 cursor-pointer"
        >
          <span className="text-xl font-bold">+ Add More</span>
        </motion.div>
      </div>

      {showDelete && (
        <button
          onClick={deleteImage}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded shadow"
        >
          Remove Selected Image
        </button>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg space-y-4 text-center w-[90%] max-w-sm">
            <p className="text-white font-semibold text-lg mb-2">Add More Images</p>
            <button
              onClick={() => navigate("/camera", { state: { adspace, existingImages: images } })}
              className="w-full bg-blue-500 py-2 rounded"
            >
              Use Camera
            </button>
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full bg-blue-500 py-2 rounded"
            >
              Choose from Files
            </button>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full border border-gray-500 py-2 rounded"
            >
              Cancel
            </button>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewSelectedImages;
