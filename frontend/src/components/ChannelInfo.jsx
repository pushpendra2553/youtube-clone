// frontend/src/components/ChannelInfo.jsx
// ----------------------------------------------------------
// Displays channel information below the video player
// Includes: channel name, uploader, subscriber count, subscribe button
// ----------------------------------------------------------

export default function ChannelInfo({
  video,                // Video object containing channel and uploader info
  currentChannel,       // Full channel object (with subscribers count)
  isSubscribed,         // Boolean indicating if the user is subscribed
  onSubscribeToggle,    // Function to handle subscribe/unsubscribe toggle
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6 border-b border-gray-200 pb-4">

      {/* Left section: Channel avatar and info */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <img
          src={video.channel?.channelBanner || "/default-avatar.png"} // Fallback image
          alt="Channel"
          className="w-16 h-16 rounded-full object-cover shadow-md flex-shrink-0"
        />
        <div className="flex flex-col">
          <p className="text-lg font-semibold text-gray-900">
            {video.channel?.channelName}
          </p>
          <p className="text-sm text-gray-600 mt-0.5">
            {video.uploader?.username}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {currentChannel?.subscribers?.toLocaleString() || 0} subscribers
          </p>
        </div>
      </div>

      {/* Right section: Subscribe button */}
      <div className="w-full md:w-auto flex justify-center md:justify-end">
        <button
          onClick={onSubscribeToggle}
          className={`px-6 py-2 rounded-full font-semibold text-sm shadow-md transition whitespace-nowrap
            ${isSubscribed
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-red-600 text-white hover:bg-red-700"}
          `}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>
    </div>
  );
}
