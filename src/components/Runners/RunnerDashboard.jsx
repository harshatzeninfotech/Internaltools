import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RunnerDashboard = () => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadModal, setUploadModal] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem("access");
      const response = await axios.get(
        "https://zen-infotech.org/adspaces/pending-tasks/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch pending adspaces:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = (adspace) => {
    setUploadModal(adspace);
  };

  const handleFileUpload = () => {
    document.getElementById("fileInput").click();
  };

  const renderStatusBar = (uploaded_at, verified) => {
    if (!uploaded_at) return null;
    const uploadedTime = new Date(uploaded_at);
    const isUploaded = uploadedTime < new Date();
    const isVerified = verified;

    return (
      <div className="mt-2 mb-1">
        <div className="flex items-center mb-1">
          <div className={`w-3 h-3 rounded-full mx-1 ${isUploaded ? 'bg-green-500' : 'bg-gray-500'}`} />
          <div className={`flex-1 h-0.5 ${isUploaded ? 'bg-green-500' : 'bg-gray-500'}`} />
          <div className={`w-3 h-3 rounded-full mx-1 ${!isVerified ? 'bg-yellow-400' : 'bg-gray-500'}`} />
          <div className={`flex-1 border-b-2 ${!isVerified ? 'border-dotted border-gray-500' : 'bg-gray-500'}`} />
          <div className={`w-3 h-3 rounded-full mx-1 ${isVerified ? 'bg-green-500' : 'bg-gray-500'}`} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 px-1">
          <span>Uploaded</span>
          <span>Pending</span>
          <span>Verified</span>
        </div>
      </div>
    );
  };

  const renderCard = (item) => (
    <motion.div layout className="bg-gray-800 text-white rounded-lg p-4 mb-4 shadow-md">
      <h2 className="text-lg font-semibold mb-1">{item.title}</h2>

      {item.remark && (
        <button
          onClick={() => alert(item.remark)}
          className="text-blue-400 font-medium mb-2"
        >
          Show Remark
        </button>
      )}

      {renderStatusBar(item.uploaded_at, item.verified)}

      <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-700">
        {item.images.map((img) => (
          <img
            key={img.id}
            src={img.image}
            alt="Ad"
            className="w-24 h-24 object-cover rounded-md"
          />
        ))}
      </div>

      <button
        onClick={() => handleUpload(item)}
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
      >
        Upload Image
      </button>
    </motion.div>
  );

  const sortedData = [...data].sort((a, b) => {
    if (!a.uploaded_at && b.uploaded_at) return -1;
    if (a.uploaded_at && !b.uploaded_at) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:hidden">
<div className="flex justify-between items-center mb-4">
  <h1 className="text-white text-2xl font-bold">Pending Adspaces</h1>
  <button
    onClick={() => {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      navigate("/login-runner");
    }}
    className="text-red-400 text-sm underline"
  >
    Logout
  </button>
</div>

      {refreshing && <p className="text-gray-400 mb-2">Refreshing...</p>}

      <AnimatePresence>
        {sortedData.map((item) => (
          <div key={item.space_id}>{renderCard(item)}</div>
        ))}
      </AnimatePresence>

      {uploadModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 p-6 rounded-xl text-white w-4/5 max-w-sm"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <h3 className="text-xl font-bold mb-4">Upload for: {uploadModal.title}</h3>

            <button
              onClick={() =>
                navigate("/camera", {
                  state: {
                    adspace: uploadModal,
                    existingImages: [],
                  },
                })
              }
              className="w-full bg-blue-500 p-2 rounded mb-2"
            >
              Use Camera
            </button>

            <button
              onClick={handleFileUpload}
              className="w-full bg-blue-500 p-2 rounded mb-2"
            >
              Choose from Files
            </button>

            <button
              onClick={() => setUploadModal(null)}
              className="w-full border border-gray-500 p-2 rounded"
            >
              Cancel
            </button>
          </motion.div>

          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files).map((file) => ({
                uri: URL.createObjectURL(file),
                type: file.type,
              }));
              setUploadModal(null);
              navigate("/review-selected-images", {
                state: { capturedImages: files, adspace: uploadModal },
              });
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default RunnerDashboard;
