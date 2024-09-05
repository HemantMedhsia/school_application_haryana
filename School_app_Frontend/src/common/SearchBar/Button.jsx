// Button.js
import React from "react";

const Button = ({ icon, label, onClick }) => {
  return (
    <div
      className="bg-gray-800 flex items-center gap-2 justify-center py-1 px-5 text-white font-semibold rounded-lg hover:shadow-lg transition duration-3000 cursor-pointer"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 opacity-30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {icon}
      </svg>
      <span>{label}</span>
    </div>
  );
};

export default Button;
