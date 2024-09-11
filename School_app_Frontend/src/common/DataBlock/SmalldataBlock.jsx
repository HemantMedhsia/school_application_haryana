// Updated SmalldataBlock.jsx
import React from "react";
import { MdCoPresent } from "react-icons/md";

const SmalldataBlock = ({ title, description, iconUrl, bgColor, value }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center p-4 bg-[#283046] shadow-lg rounded-md sm:w-1/2 md:w-1/3 lg:w-full mb-4">
      <div
        className={`p-3 text-4xl text-[#65FA9E] ${bgColor} rounded-md flex items-center justify-center mb-4 sm:mb-0 sm:mr-4`}
      >
        <MdCoPresent />
      </div>
      <div className="flex-1 w-full text-center sm:text-left">
        <h2 className="text-lg font-semibold text-[#7367F0]">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="mt-2 h-full sm:mt-0 sm:ml-auto text-center sm:text-right">
        <h2 className="text-3xl font-bold text-[#65FA9E]">{value}</h2>
      </div>
    </div>
  );
};

export default SmalldataBlock;
