// frontend/src/components/SearchBar.jsx
// ----------------------------------------------------------
// Search bar component for searching videos by title
// Features:
// - Input box with controlled state
// - Dispatches searchVideos action on submit
// - Shows loading, error messages, and search results
// Redux slice used: videoSlice (searchVideos, searchResults, loading, error)
// ----------------------------------------------------------

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchVideos } from "../features/videos/videoSlice";

const SearchBar = () => {
  // ----------------------------------------------------------
  // Local state for input text
  // ----------------------------------------------------------
  const [input, setInput] = useState("");

  // ----------------------------------------------------------
  // Redux dispatch and selectors for search results & status
  // ----------------------------------------------------------
  const dispatch = useDispatch();
  const { searchResults, searchLoading, searchError } = useSelector(
    (state) => state.videos
  );

  // ----------------------------------------------------------
  // Handle form submission to trigger video search
  // ----------------------------------------------------------
  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      dispatch(searchVideos(input));
    }
  };

  // ----------------------------------------------------------
  // Component UI
  // ----------------------------------------------------------
  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search videos by title..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={searchLoading}>
          Search
        </button>
      </form>

      {/* Status messages */}
      {searchLoading && <p>Loading...</p>}
      {searchError && <p>Error: {searchError}</p>}

      {/* Search results list */}
      <ul>
        {searchResults.map((video) => (
          <li key={video._id}>{video.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
