import React from "react";

const CheckboxGroup = ({
  labelName,
  name,
  selectedValues,
  onChange,
  options,
}) => {
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const updatedValues = checked
      ? [...selectedValues, value]
      : selectedValues.filter((v) => v !== value);

    onChange(updatedValues);
  };

  return (
    <span className="flex flex-col w-full md:w-1/3 px-2 mb-4">
      <label className="text-sm font-medium leading-none text-gray-300 mb-2">
        {labelName}
      </label>
      <div className="flex flex-wrap">
        {options.map((option) => (
          <label
            key={option._id}
            className="flex items-center text-sm text-[#FFFFFF] mr-4 mb-2"
          >
            <input
              type="checkbox"
              name={name}
              value={option.name}
              checked={selectedValues.includes(option.name)}
              onChange={handleCheckboxChange}
              className="bg-[#283046] border-2 border-gray-600 focus:border-[#6B46C1] text-[#6B46C1] rounded-[5px] mr-2 h-4 w-4 outline-none"
            />
            <span className="text-gray-300">{option.name}</span>
          </label>
        ))}
      </div>
    </span>
  );
};

export default CheckboxGroup;
