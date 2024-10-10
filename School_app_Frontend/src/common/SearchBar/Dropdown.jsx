import React, { useState } from "react";

const Dropdown = ({ label, items=[], onSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(label);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item.name || item.sessionYear); // Update the selected item to show the name
    setIsDropdownOpen(false); // Close the dropdown
    onSelect(item); // Call onSelect with the selected item
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
        <div className="absolute max-h-40 overflow-auto  top-full mt-2 bg-gray-800 text-gray-300 w-auto rounded-md shadow-lg z-20">
          <ul className="p-1">
            {items.map((item, index) => (
              <li
                key={item._id} // Use _id as the key
                className="mx-2 my-2 px-6 rounded-md hover:bg-gray-700 cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                {item.name || item.sessionYear} {/* Display the name */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
