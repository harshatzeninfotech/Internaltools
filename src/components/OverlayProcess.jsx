import { useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaSpinner,
  FaArrowLeft,
  FaTimes,
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
} from "react-icons/fa";

import Api from "../Api";

const OverlayFeatureProcess = ({ adSpaceId, adData, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage({
        file,
        uri: URL.createObjectURL(file),
      });
    }
  };

  const handleProcessImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("overlay", selectedImage.file);
    formData.append("ad_space_id", adSpaceId);

    try {
      setIsProcessing(true);
      const response = await Api.post(
        "/adspaces/process-image-temp/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setProcessedImages(response.data.images);
      console.log(response.data);
      setStep(2);
    } catch (error) {
      console.error("Processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const ImageGallery = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {processedImages.map((image, index) => {
        const imageUrl = image?.url || "default-image.jpg";

        return (
          <div key={index} className="relative group">
            {/* Image Container with Fallback */}
            <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden relative">
              <img
                src={imageUrl}
                onClick={() => setFullScreenImage(image.url)}
                alt={`Processed ${image?.name || index}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                }}
              />

              {/* Fallback Content */}
              {!image?.url && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-4">
                  <Image className="text-3xl mb-2" />
                  <span className="text-center text-sm">
                    Image not available
                  </span>
                </div>
              )}
            </div>

            {/* Image Name */}
            {image?.name && (
              <div className="mt-2 text-sm text-gray-600 truncate">
                {image.name}
              </div>
            )}
          </div>
        );
      })}

      {/* Empty State */}
      {processedImages.length === 0 && (
        <div className="col-span-full text-center py-8">
          <div className="text-gray-500 mb-4">No processed images found</div>
          <button
            onClick={() => setStep(1)}
            className="text-blue-500 hover:text-blue-600 flex items-center justify-center gap-2"
          >
            <FaPlus /> Upload New Image
          </button>
        </div>
      )}
    </div>
  );
  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      {/* <div className="flex items-center justify-between mb-6">
        <button
          onClick={onClose}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Selection
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">
          Editing: {adData?.ad_space_title}
        </h2>
      </div> */}

      {/* Step Content */}
      <div className="flex flex-col gap-6 items-center">
        {step === 1 && (
          <div className="w-full max-w-md">
            {selectedImage ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-full aspect-square max-w-md">
                  <img
                    src={selectedImage.uri}
                    alt="Selected Overlay"
                    className="w-full h-full object-contain rounded-lg border-2 border-gray-200"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </div>

                <button
                  onClick={handleProcessImage}
                  disabled={isProcessing}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    "Process Image"
                  )}
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                <FaPlus className="text-4xl text-gray-400 mb-4" />
                <span className="text-gray-600">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-gray-800">
                Processed Images ({processedImages.length})
              </h3>
              <button
                onClick={() => setStep(1)}
                className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
              >
                <FaPlus /> Upload New
              </button>
            </div>
            <ImageGallery />
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {fullScreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-[9999] flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            {/* Enhanced Close Button */}
            <button
              onClick={() => setFullScreenImage(null)}
              className="absolute -top-4 -right-4 z-50 text-white p-3 hover:bg-red-500 rounded-full 
                 transition-all transform hover:scale-110 bg-gradient-to-br from-red-400 to-red-600 
                 shadow-lg hover:shadow-xl border-2 border-white/30 hover:border-white/50"
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
            </button>

            {/* Image Display */}
            <img
              src={fullScreenImage}
              alt="Fullscreen"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OverlayFeatureProcess;
