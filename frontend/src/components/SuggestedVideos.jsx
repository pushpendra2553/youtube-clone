// frontend/src/components/SuggestedVideos.jsx
// ----------------------------------------------------------
// Displays a list of suggested videos excluding the current one
// Features:
// - Handles loading and error states
// - Shows video thumbnail, duration, title, channel info, and relative upload time
// - Each item links to its video page
// Props:
// - videos (array): array of video objects
// - currentVideoId (string): ID of the currently playing video to exclude from suggestions
// - isLoading (bool): loading state
// - error (string): error message if fetching fails
// ----------------------------------------------------------

import { Link } from 'react-router-dom';
import moment from 'moment';
import { formatDuration } from '../utils/formatDuration';

const SuggestedVideos = ({ videos = [], currentVideoId, isLoading, error }) => {
  // ----------------------------------------------------------
  // Render loading state
  // ----------------------------------------------------------
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span
          className="loader animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full"
          aria-label="Loading"
        />
      </div>
    );
  }

  // ----------------------------------------------------------
  // Render error state
  // ----------------------------------------------------------
  if (error) {
    return (
      <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md text-sm">
        {error || 'Something went wrong while loading suggested videos.'}
      </div>
    );
  }

  // ----------------------------------------------------------
  // Defensive check: ensure videos is an array
  // ----------------------------------------------------------
  if (!Array.isArray(videos)) return null;

  // ----------------------------------------------------------
  // Filter out current video from suggestions
  // ----------------------------------------------------------
  const suggested = videos.filter((video) => video._id !== currentVideoId);

  // ----------------------------------------------------------
  // Render suggested videos list
  // ----------------------------------------------------------
  return (
    <div className="space-y-4 w-full">
      <h3 className="text-lg font-bold mb-2 text-neutral-900">Suggested Videos</h3>
      {suggested.map((video) => (
        <Link
          key={video._id}
          to={`/video/${video._id}`}
          className="flex sm:flex-row flex-col gap-3 hover:bg-neutral-100 p-2 rounded-lg transition w-full"
        >
          {/* Thumbnail with duration */}
          <div className="relative w-full sm:w-36 h-24 flex-shrink-0 rounded overflow-hidden">
            <img
              src={video.thumbnailUrl || '/default-thumbnail.jpg'}
              alt={video.title || 'Video thumbnail'}
              className="w-full h-full object-cover rounded"
            />
            {video.duration && (
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                {formatDuration(video.duration)}
              </span>
            )}
          </div>

          {/* Video metadata */}
          <div className="flex flex-col justify-between overflow-hidden w-full">
            <p className="text-sm font-semibold text-neutral-900 leading-snug line-clamp-2">
              {video.title}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <img
                src={video.channel?.channelBanner || '/default-avatar.png'}
                alt={video.channel?.channelName || 'Channel'}
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-neutral-800 truncate max-w-[150px]">
                  {video.channel?.channelName || 'Unknown Channel'}
                </span>
                <span className="text-xs text-neutral-600">
                  {moment(video.createdAt).fromNow()}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SuggestedVideos;
