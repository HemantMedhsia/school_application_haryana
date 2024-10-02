import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Basic calendar styles
import './CustomCalendar.css'; // Import your custom styles

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState({
    '2024-10-01': 'Present',
    '2024-10-02': 'Absent',
    '2024-10-03': 'Present',
    // Add more attendance data here
  });

  const [date, setDate] = useState(new Date());

  const tileContent = ({ date, view }) => {
    const formattedDate = date.toISOString().split('T')[0];
    const status = attendance[formattedDate];

    if (view === 'month' && status) {
      return (
        <div
          className={`text-xs flex flex-col rounded-full mx-2 px-3 py-1 font-semibold text-center ${
            status === 'Present'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {status}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full h-full lg:w-full p-1 bg-[#283046] rounded-md shadow-lg">
        <Calendar
          value={date}
          onChange={setDate}
          tileContent={tileContent}
          className="custom-calendar pt-4 px-2 bg-gray-900 border w-full h-full border-[#65fa9e] rounded-md"
        />
      </div>
    </div>
  );
};

export default StudentAttendance;
