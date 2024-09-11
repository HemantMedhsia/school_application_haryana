import React, { useState } from 'react';

// Sample timetable data
const timetable = [
    {
      day: 'Monday',
      schedule: [
        { time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101' },
        { time: '10:00 - 11:00', subject: 'English', teacher: 'Ms. Johnson', room: '102' },
        { time: '11:00 - 12:00', subject: 'Physics', teacher: 'Mr. Brown', room: '103' },
      ],
    },
    {
      day: 'Tuesday',
      schedule: [
        { time: '09:00 - 10:00', subject: 'Chemistry', teacher: 'Dr. White', room: '104' },
        { time: '10:00 - 11:00', subject: 'Biology', teacher: 'Ms. Green', room: '105' },
        { time: '11:00 - 12:00', subject: 'History', teacher: 'Mr. Black', room: '106' },
      ],
    },
    {
      day: 'Wednesday',
      schedule: [
        { time: '09:00 - 10:00', subject: 'Geography', teacher: 'Ms. Blue', room: '107' },
        { time: '10:00 - 11:00', subject: 'Physical Education', teacher: 'Coach Grey', room: 'Gym' },
        { time: '11:00 - 12:00', subject: 'Art', teacher: 'Ms. Red', room: '108' },
      ],
    },
    {
      day: 'Thursday',
      schedule: [
        { time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101' },
        { time: '10:00 - 11:00', subject: 'English', teacher: 'Ms. Johnson', room: '102' },
        { time: '11:00 - 12:00', subject: 'Physics', teacher: 'Mr. Brown', room: '103' },
      ],
    },
    {
      day: 'Friday',
      schedule: [
        { time: '09:00 - 10:00', subject: 'Chemistry', teacher: 'Dr. White', room: '104' },
        { time: '10:00 - 11:00', subject: 'Biology', teacher: 'Ms. Green', room: '105' },
        { time: '11:00 - 12:00', subject: 'History', teacher: 'Mr. Black', room: '106' },
      ],
    },
    {
      day: 'Saturday',
      schedule: [
        { time: '09:00 - 10:00', subject: 'Chemistry', teacher: 'Dr. White', room: '104' },
        { time: '10:00 - 11:00', subject: 'Biology', teacher: 'Ms. Green', room: '105' },
        { time: '11:00 - 12:00', subject: 'History', teacher: 'Mr. Black', room: '106' },
      ],
    },
  ];

const StudentTimeTable = () => {
  const [selectedDay, setSelectedDay] = useState(null);

  const openTimetable = (day) => {
    setSelectedDay(day);
  };

  const closeTimetable = () => {
    setSelectedDay(null);
  };

  return (
    <div className="w-full mx-auto p-6 shadow-md rounded-md bg-gray-900 text-gray-100">
      <h1 className="text-2xl font-bold text-center text-[#7367F0] mb-6">Student Timetable</h1>
      <div className="grid grid-cols-1 gap-4">
        {timetable.map((daySchedule) => (
          <button
            key={daySchedule.day}
            className="p-4 bg-gradient-to-r from-[#65FA9E] text-lg to-[#7367F0] text-white rounded-md shadow hover:from-purple-600 hover:to-indigo-700 transition"
            onClick={() => openTimetable(daySchedule)}
          >
            {daySchedule.day}
          </button>
        ))}
      </div>

      {/* Modal for showing selected day schedule */}
      {selectedDay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded-md shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">{selectedDay.day} Schedule</h2>
            <ul className="space-y-3">
              {selectedDay.schedule.map((slot, index) => (
                <li
                  key={index}
                  className="p-3 bg-gray-700 rounded shadow flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-medium text-gray-100">{slot.time}</p>
                    <p className="text-gray-300">
                      {slot.subject} - {slot.teacher} ({slot.room})
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={closeTimetable}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded hover:from-red-600 hover:to-red-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTimeTable;

