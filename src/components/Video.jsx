import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoCloudUploadOutline, IoMenu } from 'react-icons/io5';
import { VscGitPullRequestCreate } from 'react-icons/vsc';
import { PropagateLoader } from 'react-spinners';
import Cookies from 'js-cookie';
import Api from '../Api';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  LoadScript,
  useJsApiLoader
} from "@react-google-maps/api";
// Define libraries as a static constant
const LIBRARIES = ['marker'];

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Custom AdvancedMarker component

const Video = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [batchId, setBatchId] = useState(null);
  const [progress, setProgress] = useState({ status: 'ideal', extracted_images: [] });
  const videoRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null);



  // Fetch batch data from the endpoint
  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const response = await Api.get('/adspaces/get_batches/');
        setBatchData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching batch data:', error);
        setLoading(false);
        setBatchData({
          completed_tasks: { count: 0, tasks: [] },
          queued_tasks: { count: 0, tasks: [] },
          running_tasks: { count: 0, tasks: [] },
        });
      }
    };

    fetchBatchData();
  }, []);

  // Handle video upload and get batch ID
  const handleVideoSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setSelectedVideo(videoURL);

      const formData = new FormData();
      formData.append('video', file);

      try {
        const response = await Api.post('/adspaces/processed_video/', formData);
        const newBatchId = response.data.batch_id;
        setBatchId(newBatchId);
        Cookies.set('batch_id', newBatchId, { expires: 7 });
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  };

  // Poll progress API every 5 seconds
  useEffect(() => {
    if (!batchId) return;

    const fetchProgress = async () => {
      try {
        const response = await Api.get(`/adspaces/get_progress/?batch_id=${batchId}`);
        setProgress({
          ...response.data,
          extracted_images: response.data.extracted_images || [],
        });
      } catch (error) {
        console.error('Error fetching progress:', error);
        setProgress({
          status: 'error',
          extracted_images: [],
          error_message: 'Failed to fetch progress',
        });
      }
    };

    fetchProgress();
    const intervalId = setInterval(fetchProgress, 5000);

    return () => clearInterval(intervalId);
  }, [batchId]);

  // Handle video playback with 5-second gap
  useEffect(() => {
    const video = videoRef.current;
    let timeoutId;

    const playWithGap = () => {
      video.play();
    };

    const handleEnded = () => {
      timeoutId = setTimeout(() => {
        video.currentTime = 0;
        playWithGap();
      }, 5000);
    };

    if (video && selectedVideo) {
      video.addEventListener('ended', handleEnded);
      playWithGap();
    }

    return () => {
      if (video) video.removeEventListener('ended', handleEnded);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [selectedVideo]);

  // Toggle dropdown
  const toggleDropdown = (type) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  // Handle batch ID click
  const handleBatchClick = async (clickedBatchId) => {
    try {
      const response = await Api.get(`/adspaces/get_progress/?batch_id=${clickedBatchId}`);
      setProgress({
        ...response.data,
        extracted_images: response.data.extracted_images || [],
      });
      setBatchId(clickedBatchId);
      setSelectedVideo(null);
    } catch (error) {
      console.error('Error fetching progress for batch:', error);
      setProgress({
        status: 'completed',
        batch_id: clickedBatchId,
        extracted_images: [],
      });
    }
  };

  // Animation variants
  const boxVariants = {
    initial: { scale: 1, boxShadow: '0px 0px 0px rgba(0,0,0,0)' },
    hover: { scale: 1.02, boxShadow: '0px 10px 20px rgba(0,0,0,0.1)', transition: { duration: 0.3 } },
    tap: { scale: 0.98 },
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const dropdownVariants = {
    open: { opacity: 1, height: 'auto', transition: { duration: 0.2 } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  const getCustomIcon = () => {
    const img = document.createElement('img');
    img.src = 'https://www.zen-infotech.org/adspaces/pin-image/';
    img.style.width = '60px';
    img.style.height = '60px';
    img.style.transform = 'translate(0, -50%)'; // Anchor at bottom-center
    return img;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
      {/* Menu Icon */}
      <div className="absolute top-0 left-0 z-20 m-5">
        <IoMenu
          className="text-3xl text-gray-600 hover:text-gray-800 cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </div>

      <div className="absolute top-0 right-0 z-20 m-5">
        <VscGitPullRequestCreate
          className="text-3xl text-gray-600 hover:text-gray-800 cursor-pointer"
          onClick={() => setProgress({ status: 'ideal', extracted_images: [] })}
        />
      </div>

      {/* Sidebar */}
      <motion.div
        initial="closed"
        animate={isMenuOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-10"
      >
        <div className="p-5 mt-10">
          <h2 className="text-xl font-bold mb-5">Batch Status</h2>
          {loading ? (
            <p className="text-gray-600">Loading batch data...</p>
          ) : batchData ? (
            <ul className="space-y-4">
              <li>
                <div className="flex items-center cursor-pointer" onClick={() => toggleDropdown('completed')}>
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-gray-600">Completed: {batchData.completed_tasks.count}</span>
                </div>
                <motion.div
                  initial="closed"
                  animate={openDropdown === 'completed' ? 'open' : 'closed'}
                  variants={dropdownVariants}
                  className="ml-5 mt-2 overflow-hidden"
                >
                  {batchData.completed_tasks.tasks.length > 0 ? (
                    batchData.completed_tasks.tasks.map((task) => (
                      <button
                        key={task.batch_id}
                        className="block text-gray-600 hover:text-gray-800 w-full text-left py-1"
                        onClick={() => handleBatchClick(task.batch_id)}
                      >
                        {task.batch_id.slice(-5)}
                      </button>
                    ))
                  ) : (
                    <span className="text-gray-500">No tasks</span>
                  )}
                </motion.div>
              </li>
              <li>
                <div className="flex items-center cursor-pointer" onClick={() => toggleDropdown('queued')}>
                  <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                  <span className="text-gray-600">Queued: {batchData.queued_tasks.count}</span>
                </div>
                <motion.div
                  initial="closed"
                  animate={openDropdown === 'queued' ? 'open' : 'closed'}
                  variants={dropdownVariants}
                  className="ml-5 mt-2 overflow-hidden"
                >
                  {batchData.queued_tasks.tasks.length > 0 ? (
                    batchData.queued_tasks.tasks.map((task) => (
                      <button
                        key={task.batch_id}
                        className="block text-gray-600 hover:text-gray-800 w-full text-left py-1"
                        onClick={() => handleBatchClick(task.batch_id)}
                      >
                        {task.batch_id.slice(-5)}
                      </button>
                    ))
                  ) : (
                    <span className="text-gray-500">No tasks</span>
                  )}
                </motion.div>
              </li>
              <li>
                <div className="flex items-center cursor-pointer" onClick={() => toggleDropdown('running')}>
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                  <span className="text-gray-600">Running: {batchData.running_tasks.count}</span>
                </div>
                <motion.div
                  initial="closed"
                  animate={openDropdown === 'running' ? 'open' : 'closed'}
                  variants={dropdownVariants}
                  className="ml-5 mt-2 overflow-hidden"
                >
                  {batchData.running_tasks.tasks.length > 0 ? (
                    batchData.running_tasks.tasks.map((task) => (
                      <button
                        key={task.batch_id}
                        className="block text-gray-600 hover:text-gray-800 w-full text-left py-1"
                        onClick={() => handleBatchClick(task.batch_id)}
                      >
                        {task.batch_id.slice(-5)}
                      </button>
                    ))
                  ) : (
                    <span className="text-gray-500">No tasks</span>
                  )}
                </motion.div>
              </li>
            </ul>
          ) : (
            <p className="text-gray-600">Failed to load batch data</p>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      {['ideal', 'video_upload', 'downloading', 'queued', 'running', 'uploading'].includes(progress.status) ? (
        <div className="flex flex-col items-center relative w-96">
          <motion.div
            variants={boxVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="relative w-96 h-64 bg-white rounded-lg overflow-hidden cursor-pointer mt-10"
          >
            {!selectedVideo ? (
              <label className="w-full h-full flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoSelect}
                />
                <IoCloudUploadOutline className="text-5xl text-gray-400" />
                <span className="text-gray-600 text-lg">
                  Upload a video or select from library
                </span>
              </label>
            ) : (
              <video
                ref={videoRef}
                src={selectedVideo}
                muted
                controls={false}
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
          {selectedVideo && (
            <div className="mt-10 flex flex-col items-center">
              <p className="text-center">
                {progress.status === 'ideal' && 'Ready to upload video'}
                {progress.status === 'video_upload' && `Uploading video... (${progress.upload_progress?.toFixed(1) || 0}%)`}
                {progress.status === 'downloading' && 'Downloading video...'}
                {progress.status === 'queued' && 'Video queued for processing...'}
                {progress.status === 'running' && `Processing video... (${progress.percentage_completed?.toFixed(1) || 0}%)`}
                {progress.status === 'uploading' && `Uploading results... (${progress.uploaded_items || 0}/${progress.total_upload_items || 0} items)`}
              </p>
              <PropagateLoader className="mt-4" color="#007AFF" />
            </div>
          )}
        </div>
      ) : progress.status === 'completed' ? (
        <div className="w-full max-w-6xl p-6">
          <h2 className="text-2xl font-bold mb-6">Processing Results</h2>

          {/* Map Display */}
          <div className="mb-8 h-96 rounded-lg overflow-hidden shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Advertisement Locations</h3>

            <LoadScript googleMapsApiKey={apiKey}>
              <div style={{ height: "500px", width: "100%" }}>
                <GoogleMap
                  mapContainerStyle={{ height: "100%", width: "100%" }}
                  center={{ lat: 18.495232, lng: 73.857813 }}
                  zoom={15}
                >
                  {progress.extracted_images.map((img, index) =>
                    img.coordinates ? (
                      <Marker
                        key={index}
                        position={{
                          lat: img.coordinates.latitude,
                          lng: img.coordinates.longitude,
                        }}
                        onClick={() => setSelectedIndex(index)}
                        icon={getCustomIcon}
                      />
                    ) : null
                  )}
                  {selectedIndex !== null && (
                    <InfoWindow
                      position={{
                        lat: progress.extracted_images[selectedIndex]
                          .coordinates.latitude,
                        lng: progress.extracted_images[selectedIndex]
                          .coordinates.longitude,
                      }}
                      onCloseClick={() => setSelectedIndex(null)}
                    >
                      <div className="w-48">
                        <img
                          src={
                            progress.extracted_images[selectedIndex].cropped
                              .image1.url
                          }
                          alt="Advertisement"
                          className="mb-2 rounded"
                        />
                        <p className="font-semibold">
                          {
                            progress.extracted_images[selectedIndex].cropped
                              .image1.category
                          }
                        </p>
                        <p>
                          Confidence:{" "}
                          {(
                            progress.extracted_images[selectedIndex].cropped
                              .image1.confidence * 100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </div>
            </LoadScript>
            </div>

          {/* Advertisement Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {progress.extracted_images.length > 0 ? (
              progress.extracted_images.map((img, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4">
                  <div className="mb-4">
                    <img
                      src={img.cropped.image1.url}
                      alt="Advertisement board"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold">
                      {img.cropped.image1.category}
                      <span className="ml-2 text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {img.cropped.image1.recognition_method}
                      </span>
                    </h4>
                    <p className="text-sm text-gray-600">
                      Confidence: {(img.cropped.image1.confidence * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">
                      Coordinates: {img.coordinates?.latitude?.toFixed(6) || 'N/A'},{' '}
                      {img.coordinates?.longitude?.toFixed(6) || 'N/A'}
                    </p>
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500">Extracted Text:</p>
                      <p className="text-sm">{img.cropped.image1.text || 'No text detected'}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No advertisements detected.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-center text-red-600">
            Error: {progress.error_message || 'An unknown error occurred'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Video;