//frontend/src/features/search/searchAPI.js
import axiosInstance from "../../utils/axiosInstance";

export const searchVideosAPI = async (searchTerm) => {
  try {
    const res = await axiosInstance.get(`/videos/search?query=${encodeURIComponent(searchTerm)}`);
    return res.data; // expected to return array of videos
  } catch (err) {
    console.error("Error searching videos:", err);
    throw new Error(err.response?.data?.message || "Error searching videos");
  }
};