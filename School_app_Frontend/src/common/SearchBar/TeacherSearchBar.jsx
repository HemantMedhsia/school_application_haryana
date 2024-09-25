import React from "react";
import IconInput from "./IconInput";

const TeacherSearchBar = ({ searchText, setSearchText }) => {
  return (
    <div className="flex flex-row-reverse flex-wrap p-2 justify-between items-center mb-4 px-4 space-y-4 space-x-0 md:space-y-0 md:space-x-4 bg-[#283046] rounded-md shadow-lg hover:shadow-xl transition duration-500 relative z-10">
      <IconInput
        icon={
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        }
        placeholder="Search teacher by name or subject..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)} // Update search text state
      />
    </div>
  );
};

export default TeacherSearchBar;
