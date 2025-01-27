import React, { useState } from "react";

const MeetingControls = () => {
  const [volume, setVolume] = useState(50); // State for slider value

  return (
    <div className="flex flex-col items-center space-y-4 mt-4">
      {/* Controls Section */}
      <div className="flex justify-between items-center w-full px-8 space-x-4">
        {/* Volume Slider */}
        <div className="flex items-center space-x-4">
          {/* Volume Icon */}
          <span className="text-gray-600">🔈</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span className="text-gray-600">🔊</span>
        </div>

        {/* Join Meeting Button */}
        <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Join Meeting
        </button>

        {/* Audio Control with Tooltip */}
        <div className="relative group">
          <button className="p-3 bg-gray-200 rounded-full hover:bg-gray-300">
            {/* Audio Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5v6a3 3 0 003 3h0a3 3 0 003-3V5m0-2a7 7 0 10-14 0v6a7 7 0 0014 0V5m-7 13v2a3 3 0 003 3h0a3 3 0 003-3v-2m0-2a7 7 0 00-14 0v2a7 7 0 0014 0z"
              />
            </svg>
          </button>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm px-3 py-1 rounded">
            Audio Off
          </div>
        </div>

        {/* Video Control with Tooltip */}
        <div className="relative group">
          <button className="p-3 bg-gray-200 rounded-full hover:bg-gray-300">
            {/* Video Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.617v6.766a1 1 0 01-1.447.894L15 14m-6 0h0a3 3 0 003 3m0-3h0a3 3 0 00-3-3m0 6v2a3 3 0 003 3m0-6v-2a3 3 0 00-3-3m0 6v-2"
              />
            </svg>
          </button>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm px-3 py-1 rounded">
            Video On
          </div>
        </div>

        {/* More Options */}
        <button className="p-3 bg-gray-200 rounded-full hover:bg-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6H6m6 0h6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MeetingControls;
