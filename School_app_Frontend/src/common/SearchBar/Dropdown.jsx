// Dropdown.js
import React, { useState } from "react";

const Dropdown = ({ label, items }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(label);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item); // Update the selected item
    setIsDropdownOpen(false); // Close the dropdown
  };

  return (
    <div className="relative">
      <div
        className="flex py-3 px-4 gap-2 rounded-lg text-gray-300 font-semibold cursor-pointer"
        onClick={toggleDropdown}
      >
        <span>{selectedItem}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isDropdownOpen && (
        <div className="absolute top-full mt-2 bg-gray-800 text-gray-300 w-auto rounded-md shadow-lg z-20">
          <ul className="p-1">
            {items.map((item, index) => (
              <li
                key={index}
                className="mx-2 my-2 px-6 rounded-md hover:bg-gray-700 cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
