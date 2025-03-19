import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaSpinner } from "react-icons/fa";
import Api from "../Api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import OverlayFeatureProcess from "./OverlayProcess";

const OverlayFeature = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(0);
  const [processedImages, setProcessedImages] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [ads, setAds] = useState({});
  const [selectedAdSpace, setSelectedAdSpace] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage({
        file,
        uri: URL.createObjectURL(file),
      });
    }
  };

  // Process image
  const handleProcessImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("overlay", selectedImage.file);

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
      setStep(2);
    } catch (error) {
      console.error("Processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Responsive image gallery
  const ImageGallery = ({ images }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <img
            src={image.url}
            alt={`Processed ${index}`}
            className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => {
              setFullScreenImage(image.url);
              setIsFullScreen(true);
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
            <button
              className="opacity-0 group-hover:opacity-100 text-white bg-blue-500 px-4 py-2 rounded-lg transition-opacity"
              onClick={() => {
                /* Add download handler */
              }}
            >
              Download
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Fetch ads on component mount
  useEffect(() => {
    const getAdspace = async () => {
      try {
        const response = await Api.get("/adspaces/landing_image/");
        setAds(response.data.grouped_images);
      } catch (error) {
        console.error(error);
      }
    };
    getAdspace();
  }, []);

  // Handle Try Now click
  const handleTryNow = (ad, spaceId) => {
    setSelectedAdSpace(spaceId);
    setStep(1);
  };

  // Handle back to selection
  const handleBack = () => {
    setStep(0);
    setSelectedAdSpace(null);
  };

  // Handle Try Now click
  // const handleTryNow = (ad, spaceId) => {
  //   setSelectedAdSpace(spaceId);
  //   setShowOverlay(true);
  //   // Scroll to selected card
  //   document.getElementById(`item-${spaceId}`)?.scrollIntoView({
  //     behavior: "smooth",
  //     block: "start",
  //   });
  // };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        <div
          className={`h-2 w-24 rounded-full ${
            step === 0 ? "bg-blue-500" : "bg-gray-300"
          }`}
        />
        <div
          className={`h-2 w-24 rounded-full ${
            step === 1 ? "bg-blue-500" : "bg-gray-300"
          }`}
        />
      </div>

      {step === 0 ? (
        /* STEP 0: Ad Space Selection */
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Choose an Ad Space
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(ads).map(([adSpaceId, ad]) => (
              <div
                key={adSpaceId}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105"
              >
                {/* ... (Your existing Swiper carousel code) */}
                {/* Image Carousel */}
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className="h-64 w-full"
                >
                  {ad.images.map((image, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={
                          image.image_url ||
                          "https://www.zen-infotech.org/media/ad_images/images.png"
                        }
                        alt={`Ad ${adSpaceId} - ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                {/* Ad Space Info */}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {ad.ad_space_title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {ad.images.length} images available
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTryNow(ad, adSpaceId);
                    }}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Try Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* STEP 1: Overlay Features */
        <div>
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              ← Back to Selection
            </button>
            <h2 className="text-2xl font-semibold">
              Editing: {ads[selectedAdSpace]?.ad_space_title}
            </h2>
          </div>

          {/* Selected Ad Preview */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination
                className="h-64"
              >
                {ads[selectedAdSpace]?.images.map((image, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={image.image_url}
                      className="w-full h-full object-cover"
                      alt="Selected Ad"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Overlay Feature Component */}
          <OverlayFeatureProcess
            adSpaceId={selectedAdSpace}
            adData={ads[selectedAdSpace]}
            onComplete={handleBack}
          />
        </div>
      )}
    </div>
  );
  // return (
  //   <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 mt-6">
  //     <h2 className="text-2xl font-semibold text-gray-800 mb-6">
  //       Try Your IMG On Flex
  //     </h2>

  //     <div className="flex flex-col gap-6 items-center">
  //       {step === 1 && (
  //         <div className="w-full max-w-md">
  //           {selectedImage ? (
  //             <div className="flex flex-col items-center gap-4">
  //               <div className="relative w-full aspect-square max-w-md">
  //                 <img
  //                   src={selectedImage.uri}
  //                   alt="Selected Overlay"
  //                   className="w-full h-full object-contain rounded-lg border-2 border-gray-200"
  //                 />
  //                 <button
  //                   onClick={() => setSelectedImage(null)}
  //                   className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
  //                 >
  //                   <FaTrash className="text-lg" />
  //                 </button>
  //               </div>

  //               <button
  //                 onClick={handleProcessImage}
  //                 disabled={isProcessing}
  //                 className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
  //                   isProcessing
  //                     ? "bg-gray-400 cursor-not-allowed"
  //                     : "bg-green-500 hover:bg-green-600 text-white"
  //                 }`}
  //               >
  //                 {isProcessing ? (
  //                   <div className="flex items-center justify-center gap-2">
  //                     <FaSpinner className="animate-spin" />
  //                     Processing...
  //                   </div>
  //                 ) : (
  //                   "Process Image"
  //                 )}
  //               </button>
  //             </div>
  //           ) : (
  //             <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
  //               <FaPlus className="text-4xl text-gray-400 mb-4" />
  //               <span className="text-gray-600">Upload Image</span>
  //               <input
  //                 type="file"
  //                 accept="image/*"
  //                 className="hidden"
  //                 onChange={handleImageUpload}
  //               />
  //             </label>
  //           )}
  //         </div>
  //       )}

  //       {step === 2 && (
  //         <div className="w-full">
  //           <div className="flex justify-between items-center mb-6">
  //             <h3 className="text-xl font-medium text-gray-800">
  //               Processed Images
  //             </h3>
  //             <button
  //               onClick={() => setStep(1)}
  //               className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
  //             >
  //               <FaPlus /> Upload New
  //             </button>
  //           </div>
  //           <ImageGallery images={processedImages} />
  //         </div>
  //       )}
  //     </div>

  //     {/* Fullscreen Modal */}
  //     {isFullScreen && (
  //       <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
  //         <div className="relative max-w-full max-h-full">
  //           <img
  //             src={fullScreenImage}
  //             alt="Fullscreen"
  //             className="max-w-full max-h-[90vh] object-contain"
  //           />
  //           <button
  //             onClick={() => setIsFullScreen(false)}
  //             className="absolute top-4 right-4 text-white text-2xl bg-black/50 rounded-full p-2 hover:bg-black/80"
  //           >
  //             ×
  //           </button>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default OverlayFeature;
