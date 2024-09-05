// IconInput.js
import React from "react";

const IconInput = ({ icon, placeholder }) => {
  return (
    <div className="flex bg-gray-900 text-gray-100 px-4 py-1 w-72 space-x-4 rounded-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 opacity-30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {icon}
      </svg>
      <input
        className="bg-gray-900 outline-none"
        type="text"
        placeholder={placeholder}
      />
    </div>
  );
};

export default IconInput;

