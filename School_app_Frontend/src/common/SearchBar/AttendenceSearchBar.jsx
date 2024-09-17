import React from "react";
import IconInput from "./IconInput";
import Dropdown from "./Dropdown";
import Button from "./Button";
import DateInput from "./DateInput";

const AttendenceSearchBar = () => {
  return (
    <div className="flex sm:flex-col md:flex-row flex-wrap justify-between items-center mb-4 px-4 space-y-4 md:space-y-0 md:space-x-4 bg-[#283046] rounded-md shadow-lg hover:shadow-xl transition duration-500 relative z-10">
      <div className="w-full md:w-auto">
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
          className="w-full my-2"
        />
      </div>

      <div className="w-full md:w-auto">
        <Dropdown label="All Class" items={["Class 1", "Class 2", "Class 3"]} className="w-full md:w-auto" />
      </div>

      <div className="w-full md:w-auto">
        <Dropdown label="Section" items={["Section A", "Section B", "Section C", "Section D"]} className="w-full md:w-auto" />
      </div>

      <div className="w-full md:w-auto">
        <DateInput className="w-full md:w-auto" />
      </div>

      <div className="w-full md:w-auto">
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
          className="w-full md:w-auto"
        />
      </div>
    </div>
  );
};

export default AttendenceSearchBar;
