import React, { useState } from "react";

const TimeInput = ({
  labelName,
  name,
  value,
  onChange,
  placeholder = "Select Time",
}) => {
  const [timeValue, setTimeValue] = useState(value || "");

  const handleTimeChange = (e) => {
    setTimeValue(e.target.value);
    onChange({
      target: {
        name,
        value: e.target.value,
      },
    });
  };

  return (
    <div className="flex flex-col w-1/3 md:w-1/3 px-2 mb-4 relative">
      <label className="text-sm font-medium leading-none text-gray-400">
        {labelName}
      </label>
      <input
        type="time"
        name={name}
        value={timeValue}
        onChange={handleTimeChange}
        placeholder={placeholder}
        className="bg-[#283046] text-sm text-[#FFFFFF] mt-2 w-full h-9 rounded-[5px] border-2 border-[#39424E] focus:border-[#6B46C1] outline-none px-2"
      />
    </div>
  );
};

export default TimeInput;
