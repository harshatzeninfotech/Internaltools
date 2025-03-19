import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ModifiedOverlay = () => {
  const [imageA, setImageA] = useState(null);
  const [imageB, setImageB] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [processedImage, setProcessedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  // Handle file uploads
  const handleImageUpload = (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setUploadedImages((prev) => [...prev, imageUrl]);
    }
  };

  // Remove uploaded image
  const removeImage = (setImage, imageUrl) => {
    setImage(null);
    setUploadedImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  // Handle processing (show next image in section C)
  const handleProcess = () => {
    if (uploadedImages.length > 0) {
      setProcessedImage(uploadedImages[currentIndex]);
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 < uploadedImages.length ? prevIndex + 1 : 0
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <motion.h1
        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Modified BillBoard Ai
      </motion.h1>

      <motion.div
        className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-8 flex flex-col space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-6 border border-purple-100"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* A Section - Image Upload */}
        <motion.div
          className="flex flex-col items-center space-y-4 relative w-full"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2 className="text-xl font-bold text-indigo-700 bg-indigo-50 px-4 py-2 rounded-full">
            Random BillBoard
          </h2>
          {imageA ? (
            <motion.div
              className="relative w-full aspect-square border-2 border-indigo-200 rounded-lg flex items-center justify-center overflow-hidden bg-indigo-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={imageA || "/placeholder.svg"}
                alt="A"
                className="h-full w-full object-contain rounded-lg cursor-pointer"
                onClick={() => setFullScreenImage(imageA)}
              />
              <motion.button
                onClick={() => removeImage(setImageA, imageA)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTrash />
              </motion.button>
            </motion.div>
          ) : (
            <motion.label
              className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-100/50 transition-all"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <FaPlus className="text-4xl text-indigo-400 mb-4" />
              <span className="text-indigo-600 font-medium">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, setImageA)}
              />
            </motion.label>
          )}
        </motion.div>

        {/* B Section - Image Upload */}
        <motion.div
          className="flex flex-col items-center space-y-4 relative w-full"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2 className="text-xl font-bold text-purple-700 bg-purple-50 px-4 py-2 rounded-full">
            OverLay Img
          </h2>
          {imageB ? (
            <motion.div
              className="relative w-full aspect-square border-2 border-purple-200 rounded-lg flex items-center justify-center overflow-hidden bg-purple-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={imageB || "/placeholder.svg"}
                alt="B"
                className="h-full w-full object-contain rounded-lg cursor-pointer"
                onClick={() => setFullScreenImage(imageB)}
              />
              <motion.button
                onClick={() => removeImage(setImageB, imageB)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTrash />
              </motion.button>
            </motion.div>
          ) : (
            <motion.label
              className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:border-purple-500 bg-purple-50/50 hover:bg-purple-100/50 transition-all"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 4px 12px rgba(126, 34, 206, 0.15)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <FaPlus className="text-4xl text-purple-400 mb-4" />
              <span className="text-purple-600 font-medium">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, setImageB)}
              />
            </motion.label>
          )}
        </motion.div>

        {/* C Section - Processed Image */}
        <motion.div
          className="flex flex-col items-center space-y-4 w-full"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2 className="text-xl font-bold text-blue-700 bg-blue-50 px-4 py-2 rounded-full">
            Final Result
          </h2>
          <motion.div
            className="w-full aspect-square border-2 border-blue-200 rounded-lg flex items-center justify-center bg-blue-50/50"
            animate={{
              boxShadow: processedImage
                ? "0 8px 30px rgba(59, 130, 246, 0.2)"
                : "0 4px 6px rgba(59, 130, 246, 0.1)",
            }}
            transition={{ duration: 0.5 }}
          >
            {processedImage ? (
              <motion.img
                src={processedImage}
                alt="Processed"
                className="h-full w-full object-contain rounded-lg cursor-pointer"
                onClick={() => setFullScreenImage(processedImage)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              />
            ) : (
              <motion.span
                className="text-blue-500 font-medium flex flex-col items-center"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mb-2 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                No Image Processed
              </motion.span>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Process Button */}
      <motion.button
        onClick={handleProcess}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
        disabled={uploadedImages.length === 0}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)",
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        Process Images
      </motion.button>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {fullScreenImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-95 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullScreenImage(null)}
          >
            <motion.div
              className="relative max-w-full max-h-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Enhanced Close Button */}
              <motion.button
                onClick={() => setFullScreenImage(null)}
                className="absolute -top-4 -right-4 z-50 text-white p-3 rounded-full 
               transition-all transform bg-gradient-to-br from-red-400 to-red-600 
               shadow-lg border-2 border-white/30"
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 20px rgba(239, 68, 68, 0.6)",
                  borderColor: "rgba(255, 255, 255, 0.5)",
                }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>

              {/* Image Display */}
              <motion.img
                src={fullScreenImage}
                alt="Fullscreen"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModifiedOverlay;
