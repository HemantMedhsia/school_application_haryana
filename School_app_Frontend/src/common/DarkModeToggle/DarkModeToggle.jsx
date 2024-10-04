import React, { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggle = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="flex items-center" onClick={handleToggle}>
      {/* Mobile Version - Hide Toggle Buttons */}
      <div className="flex md:hidden" >
        {isDarkMode ? (
          <FaMoon className="text-2xl text-white transition-colors duration-300" />
        ) : (
          <FaSun className="text-2xl text-yellow-500 transition-colors duration-300" />
        )}
      </div>

      {/* Desktop Version - Show Toggle Buttons */}
      <div
        className="hidden md:flex items-center p-1 bg-gray-900 border-[#65fa9e] border rounded-full relative w-28 h-8"
        onClick={handleToggle}
      >
        <div
          className={`absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-1/2 rounded-full transition-transform duration-300 ${
            isDarkMode ? "translate-x-12 bg-indigo-100" : "bg-indigo-100"
          }`}
        />

        <button
          className={`relative text-xs w-1/2  h-full rounded-full font-semibold transition-colors duration-300 z-10 ${
            !isDarkMode ? "text-gray-900" : "text-white"
          }`}
          onClick={() => setIsDarkMode(false)}
        >
          Light
        </button>

        <button
          className={`relative text-xs w-1/2 h-full rounded-full font-semibold transition-colors duration-300 z-10 ${
            isDarkMode ? "text-gray-900" : "text-[#65fa9e]"
          }`}
          onClick={() => setIsDarkMode(true)}
        >
          Dark
        </button>
      </div>

      {/* Desktop Sun and Moon Icons */}
      <div className="hidden md:block ml-2">
        {isDarkMode ? (
          <FaMoon className="text-2xl text-white transition-colors duration-300" />
        ) : (
          <FaSun className="text-2xl text-yellow-500 transition-colors duration-300" />
        )}
      </div>
    </div>
  );
}

export default DarkModeToggle;
