import React from "react";
import IconInput from "./IconInput";
import Dropdown from "./Dropdown";
import Button from "./Button";

const SearchBar = () => {
  return (
    <div className="flex flex-col md:flex-row md:flex-wrap justify-between items-center mb-6 sm:p-4 px-4 py-2 space-y-4 md:space-y-0 md:space-x-6 bg-[#283046] rounded-md shadow-lg hover:shadow-xl transition duration-500 relative z-10">
      {/* Search input */}
      <div className="w-full md:flex-1 lg:w-1/2">
        <IconInput
          icon={
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          }
          placeholder="Article name or keyword..."
        />
      </div>

      {/* Class Dropdown */}
      <div className="w-full md:w-auto lg:flex-1">
        <Dropdown label="All Class" items={["Class 1", "Class 2", "Class 3"]} />
      </div>

      {/* Section Dropdown */}
      <div className="w-full md:w-auto lg:flex-1">
        <Dropdown
          label="Section"
          items={["Section A", "Section B", "Section C", "Section D"]}
        />
      </div>

      {/* Session Dropdown */}
      <div className="w-full md:w-auto lg:flex-1">
        <Dropdown
          label="Session"
          items={["2024-2025", "2025-2026", "2026-2027"]}
        />
      </div>

      {/* Search Button */}
      <div className="w-full md:w-auto flex justify-center lg:justify-start">
        <Button
          icon={
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          }
          label="Search"
          onClick={() => console.log("Search clicked")}
        />
      </div>
    </div>
  );
};

export default SearchBar;
