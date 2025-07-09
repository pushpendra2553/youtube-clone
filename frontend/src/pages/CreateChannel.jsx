// frontend/src/components/CreateChannelForm.jsx
// ----------------------------------------------------------
// Form component for creating a new channel
// Handles input fields for channel name, description, and banner image
// Submits data as multipart/form-data to backend via Redux async thunk
// ----------------------------------------------------------

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createChannel } from '../features/channel/channelSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateChannelForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select channel slice state: currentChannel, loading, error
  const { currentChannel, loading, error } = useSelector(
    (state) => state.channel
  );

  // Local state for form inputs
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [channelBanner, setChannelBanner] = useState(null);

  // ----------------------------------------------------------
  // Form submission handler
  // Prepares FormData and dispatches createChannel thunk
  // On success: shows toast and navigates to new channel page
  // On failure: shows error toast
  // ----------------------------------------------------------
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

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="space-y-4 max-w-md mx-auto mt-10"
    >
      <h2 className="text-xl font-semibold">Create Your Channel</h2>

      {/* Channel Name Input */}
      <input
        type="text"
        name="channelName"
        placeholder="Channel Name"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />

      {/* Channel Description Input */}
      <textarea
        placeholder="Channel Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />

      {/* Channel Banner Image Upload */}
      <input
        name="banner"
        type="file"
        accept="image/*"
        onChange={(e) => setChannelBanner(e.target.files[0])}
        className="w-full"
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Creating...' : 'Create Channel'}
      </button>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default CreateChannelForm;
