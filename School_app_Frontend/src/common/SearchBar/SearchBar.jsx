// SearchBar.js
import React from "react";
import IconInput from "./IconInput";
import Dropdown from "./Dropdown";
import Button from "./Button";

const SearchBar = () => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-4 px-4 space-y-4 space-x-0 md:space-y-0 md:space-x-4 bg-[#283046] rounded-md shadow-lg hover:shadow-xl transition duration-500 relative z-10">
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

      <Dropdown label="All Class" items={["Class 1", "Class 2", "Class 3"]} />

      <Dropdown label="Section" items={["Section A", "Section B", "Section C", "Section D"]} />

      <Dropdown label="Session" items={["2024-2025", "2025-2026", "2026-2027"]} />

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
  );
};

export default SearchBar;
