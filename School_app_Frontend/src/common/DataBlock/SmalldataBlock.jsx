import React from "react";

const SmalldataBlock = ({ title, description, iconUrl, bgColor, value }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center p-4 bg-[#283046] shadow-lg rounded-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/3 my-2">
      <div
        className={`w-14 h-14 ${bgColor} rounded-lg flex items-center justify-center mb-4 sm:mb-0 sm:mr-4`}
      >
        <img src={iconUrl} alt="icon" className="w-8 h-8" />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="mt-2 sm:mt-0 sm:ml-auto text-center sm:text-right">
        <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
      </div>
    </div>
  );
};

export default SmalldataBlock;
