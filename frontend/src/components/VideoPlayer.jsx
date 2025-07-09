// frontend/src/components/VideoPlayer.jsx
// ----------------------------------------------------------
// Video player component with loading and error handling
// Features:
// - Shows loading overlay until video is ready
// - Handles video load errors with toast notification and error message
// - Displays video metadata (title, upload time, views, likes, dislikes)
// Props:
// - video (object): video data including videoUrl, title, createdAt, views, likes, dislikes
// ----------------------------------------------------------

import { useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";

export default function VideoPlayer({ video }) {
  // ----------------------------------------------------------
  // Local state for loading and error status
  // ----------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ----------------------------------------------------------
  // Called when video metadata and first frame have loaded
  // ----------------------------------------------------------
  const handleLoadedData = () => {
    setLoading(false);
  };

  // ----------------------------------------------------------
  // Called on video loading error; sets error state and shows toast
  // ----------------------------------------------------------
  const handleError = () => {
    setLoading(false);
    setError(true);
    toast.error("Failed to load video.");
  };

  // ----------------------------------------------------------
  // Component UI
  // ----------------------------------------------------------
  return (
    <>
      <div className="aspect-video mb-4 relative w-full">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 rounded-xl">
            <div className="text-white font-semibold animate-pulse">Loading video...</div>
          </div>
        )}

        {/* Video element */}
        <video
          src={video.videoUrl}
          controls
          className={`w-full h-full rounded-xl shadow-lg ${
            loading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
          onLoadedData={handleLoadedData}
          onError={handleError}
        />
      </div>

      {/* Error message or video metadata */}
      {error ? (
        <div className="text-red-600 text-sm font-medium mb-2">
          Unable to display video.
        </div>
      ) : (
        <>
          <h1 className="text-xl font-bold mb-2">{video.title}</h1>

          <div className="flex flex-wrap justify-between items-center text-sm text-gray-600 mb-4">
            <span>{moment(video.createdAt).fromNow()}</span>
            <span className="text-xs sm:text-sm">
              {video.views || 0} views • {video.likes?.length || 0} Likes •{" "}
              {video.dislikes?.length || 0} Dislikes
            </span>
          </div>
        </>
      )}
    </>
  );
}
