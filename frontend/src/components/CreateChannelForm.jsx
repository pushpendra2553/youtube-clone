// frontend/src/components/CreateChannelForm.jsx
// ----------------------------------------------------------
// UI component to create a new channel
// Includes fields for name, description, and optional banner upload
// Integrates with Redux Toolkit and redirects after success
// ----------------------------------------------------------

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createChannel,
  clearChannelState,
} from '../features/channel/channelSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from './Loader';

const CreateChannelForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Extract channel-related state from Redux store
  const { currentChannel, loading, error } = useSelector(
    (state) => state.channel
  );

  // Local state for form inputs
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [channelBanner, setChannelBanner] = useState(null);

  // Clear channel slice state on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearChannelState());
    };
  }, [dispatch]);

  // If channel creation is successful, redirect to channel page
  useEffect(() => {
    if (currentChannel && currentChannel._id) {
      navigate(`/channel/${currentChannel._id}`);
    }
  }, [currentChannel, navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('channelName', channelName);
    formData.append('description', description);
    if (channelBanner) {
      formData.append('banner', channelBanner);
    }

    try {
      const createdChannel = await dispatch(createChannel(formData)).unwrap();
      toast.success('Channel created successfully!');
      navigate(`/channel/${createdChannel._id}`);
    } catch (error) {
      toast.error(error.message || 'Channel creation failed');
    }
  };

  // Don't show form if user already has a channel
  if (currentChannel && currentChannel._id) return null;

  return (
    <div className="relative">
      {/* Loader overlay during API call */}
      {loading && (
        <div className="absolute inset-0 z-10 bg-white bg-opacity-60 flex items-center justify-center">
          <Loader />
        </div>
      )}

      {/* Channel Creation Form */}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-4 max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow"
      >
        <h2 className="text-xl font-semibold text-center">Create Your Channel</h2>

        <input
          type="text"
          name="channelName"
          placeholder="Channel Name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          placeholder="Channel Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          name="banner"
          type="file"
          accept="image/*"
          onChange={(e) => setChannelBanner(e.target.files[0])}
          className="w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Create Channel'}
        </button>

        {/* Display error if any */}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
      </form>
    </div>
  );
};

export default CreateChannelForm;
