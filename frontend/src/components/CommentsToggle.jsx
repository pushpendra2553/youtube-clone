// frontend/src/components/CommentsToggle.jsx
// ----------------------------------------------------------
// Wrapper component that toggles visibility of CommentSection
// Displays "Show/Hide Comments" button and conditionally renders comments
// ----------------------------------------------------------

import { useState } from "react";
import CommentSection from "./CommentSection";

export default function CommentsToggle({ videoId }) {
  // Local state to toggle comments visibility
  const [showComments, setShowComments] = useState(true);

  return (
    <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow">
      {/* Toggle Button */}
      <button
        className="font-medium text-blue-600 hover:underline"
        onClick={() => setShowComments((prev) => !prev)}
      >
        {showComments ? "Hide Comments" : "Show Comments"}
      </button>

      {/* Conditionally render CommentSection */}
      {showComments && (
        <div className="mt-4">
          <CommentSection videoId={videoId} />
        </div>
      )}
    </div>
  );
}
