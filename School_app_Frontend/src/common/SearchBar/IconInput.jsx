import React from "react";

const IconInput = ({ icon, placeholder, value, onChange }) => {
  return (
    <div className="flex items-center bg-gray-900 text-gray-100 px-4 py-2 w-full md:w-72 space-x-2 rounded-lg">
      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 opacity-30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {icon}
      </svg>

      {/* Input Field */}
      <input
        className="bg-transparent flex-grow outline-none text-sm md:text-base"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange} // Ensure onChange is passed to the input
      />
    </div>
  );
};

export default IconInput;
