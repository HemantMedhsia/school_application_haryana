import React from 'react';

const Input = ({ labelName, type = "text", placeholder = "", ...props }) => {
  return (
    <span className="flex flex-col w-full md:w-1/3 px-2 mb-4">
      <label className="text-sm font-medium leading-none text-gray-300">
        {labelName}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="bg-[#283046] mt-2 text-sm w-full h-9 rounded-[5px] p-2.5 text-[#FFFFFF] border-2 border-gray-600 focus:border-[#6B46C1] outline-none"
        {...props}
      />
    </span>
  );
};

export default Input;
