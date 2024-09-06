import React from 'react';

const Select = ({ labelName, name, value, onChange, options, placeholder = "Select" }) => {
  return (
    <span className="flex flex-col w-full md:w-1/3 px-2 mb-4">
      <label className="text-sm font-medium leading-none text-gray-400">{labelName}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="bg-[#283046] text-sm text-[#FFFFFF] mt-2 w-full h-9 rounded-[5px] border-2 border-[#39424E] focus:border-[#6B46C1] outline-none"
      >
        <option value="" disabled className="text-gray-500">
          {placeholder} {labelName}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id} className="text-[#FFFFFF]">
            {option.name}
          </option>
        ))}
      </select>
    </span>
  );
};

export default Select;
