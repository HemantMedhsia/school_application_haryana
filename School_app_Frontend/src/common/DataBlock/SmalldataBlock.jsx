// Updated SmalldataBlock.jsx
import React from "react";
import { MdCoPresent } from "react-icons/md";

const SmalldataBlock = ({ title, description, iconUrl, bgColor, value }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center  sm:items-center p-4 bg-[#283046] shadow-lg rounded-md sm:full md:w-1/3 lg:w-full mb-4">
      <div
        className={`p-3 text-3xl sm:text-4xl text-[#65FA9E] ${bgColor} rounded-md flex items-center justify-center mb-4 sm:mb-0 sm:mr-4`}
      >
        <MdCoPresent />
      </div>
      <div className="flex-1 mx-2 w-full text-center sm:text-left">
        <h2 className="text-base sm:text-lg font-semibold text-[#7367F0]">{title}</h2>
        <p className="text-xs sm:text-sm text-gray-500">{description}</p>
      </div>
      <div className="mt-2 sm:mt-0 sm:ml-auto text-center sm:text-right">
        <h2 className="text-xl sm:text-2xl border-2 border-gray-900 shadow-[#65FA9E] rounded-3xl px-2 py-1 bg-gray-900 font-semibold font-serif text-[#65FA9E]">{value}</h2>
      </div>
    </div>
  );
};

export default SmalldataBlock;
