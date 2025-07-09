// frontend/src/components/DescriptionToggle.jsx
// ----------------------------------------------------------
// Toggleable video description component
// Features:
// - Shows a "Show Description" / "Hide Description" button
// - Toggles visibility of the video description
// Props:
// - description (string): full video description text
// ----------------------------------------------------------

import { useState } from "react";

export default function DescriptionToggle({ description }) {
  // ----------------------------------------------------------
  // Local state: controls whether description is shown or hidden
  // ----------------------------------------------------------
  const [showDescription, setShowDescription] = useState(false);

  // ----------------------------------------------------------
  // Component UI
  // ----------------------------------------------------------
  return (
    <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow">
      {/* Toggle button */}
      <button
        className="font-medium text-blue-600 hover:underline"
        onClick={() => setShowDescription((prev) => !prev)}
      >
        {showDescription ? "Hide Description" : "Show Description"}
      </button>

      {/* Description content (conditionally rendered) */}
      {showDescription && (
        <p className="text-gray-800 whitespace-pre-wrap mt-2">
          {description}
        </p>
      )}
    </div>
  );
}
