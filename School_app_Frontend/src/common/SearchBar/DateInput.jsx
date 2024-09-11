import React, { useRef } from 'react';
import { FaCalendarAlt } from 'react-icons/fa'; // You can use any icon library

const DateInput = () => {
  const dateInputRef = useRef(null);

  const handleClick = () => {
    dateInputRef.current.showPicker(); // Show the native date picker
  };

  return (
    <div className="relative flex items-center justify-center"
    onClick={handleClick}
    >
      <input
        ref={dateInputRef}
        className="bg-gray-900 cursor-pointer font-semibold text-gray-100 rounded-md py-1 px-3 outline-none focus:ring focus:ring-[#7367F0] focus:ring-opacity-50 appearance-none"
        type="date"
      />
      <button
        type="button"
        className="absolute right-3 text-[#65FA9E] hover:text-gray-300"
      >
        <FaCalendarAlt size={20} />
      </button>
    </div>
  );
}

export default DateInput;
