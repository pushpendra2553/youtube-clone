// frontend/src/pages/EditVideoPage.jsx
// ----------------------------------------------------------
// Page component to edit an existing video
// Fetches video by ID from URL params, displays edit form,
// handles form submission to update video,
// shows loader and error states accordingly.
// ----------------------------------------------------------

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getVideoById, updateVideo } from "../features/video/videoSlice";
import EditVideoForm from "../components/EditVideoForm";
import { toast } from "react-toastify";
import Loader from "../components/Loader"; // Loader spinner component

const EditVideoPage = () => {
  // ----------------------------------------------------------
  // Get video ID from route params
  // ----------------------------------------------------------
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ----------------------------------------------------------
  // Select video and auth state from Redux store
  // ----------------------------------------------------------
  const { selectedVideo, videoUpdating, videoFetching, error } = useSelector(
    (state) => state.videos
  );
  const { user } = useSelector((state) => state.auth);

  // Get user's first channel ID for redirect after update
  const channelId = user?.channels?.[0]?._id || user?.channels?.[0];

  // ----------------------------------------------------------
  // Fetch video details on mount or when ID changes
  // ----------------------------------------------------------
  useEffect(() => {
    if (id) dispatch(getVideoById(id));
  }, [dispatch, id]);

  // ----------------------------------------------------------
  // Handler to submit updated video data
  // Dispatches updateVideo thunk, shows toast, and redirects
  // ----------------------------------------------------------
  const handleSubmit = async (formData) => {
    try {
      await dispatch(updateVideo({ id, formData })).unwrap();
      toast.success("Video updated successfully!");
      navigate(`/channel/${channelId}`);
    } catch (err) {
      console.error("Video update error:", err);
      toast.error("Failed to update video. Please try again.");
    }
  };

  // ----------------------------------------------------------
  // Render loading, error, or no video found states
  // ----------------------------------------------------------
  if (videoFetching) return <Loader />;
  if (error)
    return (
      <p className="text-red-500 text-center mt-5">Error: {error}</p>
    );
  if (!selectedVideo)
    return <p className="text-center mt-5">No video found</p>;

  // ----------------------------------------------------------
  // Render EditVideoForm with current video data and submit handler
  // ----------------------------------------------------------
  return (
    <div className="max-w-3xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Video</h2>
      <EditVideoForm
        video={selectedVideo}
        onSubmit={handleSubmit}
        videoUpdating={videoUpdating}
      />
    </div>
  );
};

export default EditVideoPage;
