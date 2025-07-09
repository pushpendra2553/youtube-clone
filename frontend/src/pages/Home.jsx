// frontend/src/pages/Home.jsx
// ----------------------------------------------------------
// Home page component displaying list of videos
// Supports filtering by category and search term
// Fetches all videos on mount and manages filtered display
// ----------------------------------------------------------

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllVideos } from "../features/video/videoSlice";
import FilterBar from '../components/FilterBar';
import Loader from '../components/Loader';
import VideoCard from '../components/VideoCard';

const Home = () => {
  const dispatch = useDispatch();

  // Select video, search term and UI states from redux
  const { videos, loading } = useSelector((state) => state.videos);
  const { term } = useSelector((state) => state.search);
  const { isSidebarOpen } = useSelector((state) => state.ui);

  // Local state to track selected category filter, default 'All'
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Fetch all videos on component mount
  useEffect(() => {
    dispatch(fetchAllVideos());
  }, [dispatch]);

  // Handler for selecting a filter
  // Toggles filter off if clicking the active one again
  const handleSelectFilter = (filter) => {
    if (selectedFilter === filter) {
      setSelectedFilter('All');
    } else {
      setSelectedFilter(filter);
    }
  };

  // Memoized filtered videos based on selectedFilter and search term
  const filteredVideos = useMemo(() => {
    let filtered = videos;

    // Filter by category if not 'All'
    if (selectedFilter !== 'All') {
      filtered = filtered.filter((video) => video.category === selectedFilter);
    }

    // Filter by search term in video title
    if (term.trim()) {
      const lower = term.toLowerCase();
      filtered = filtered.filter((video) =>
        video.title?.toLowerCase().includes(lower)
      );
    }

    return filtered;
  }, [videos, selectedFilter, term]);

  // Show loader if loading videos
  if (loading) return <Loader />;

  // Flags for UI conditions
  const isFetchingCompleted = !loading && videos.length > 0;
  const isNoVideosAfterFilter = isFetchingCompleted && filteredVideos.length === 0;

  return (
    <div className="w-full">
      {/* Filter bar component for category selection */}
      <FilterBar selectedFilter={selectedFilter} onSelectFilter={handleSelectFilter} />

      {/* Show message if no videos match filters */}
      {isNoVideosAfterFilter ? (
        <p className="text-center text-gray-600 mt-10">No videos found.</p>
      ) : (
        // Video grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {filteredVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
