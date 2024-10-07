import React from "react";

const TimeTablePrintClasswise = ({ timetable, daysOfWeek, className }) => {

  const formatTime = (timeString) => {
    const [startTime, endTime] = timeString.split(" - ");
    const format = (time) => {
      const [hour, minute] = time.split(":").map(Number);
      const ampm = hour >= 12 ? "PM" : "AM";
      const formattedHours = hour % 12 || 12;
      const formattedMinutes = minute < 10 ? `0${minute}` : minute;
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    return `${format(startTime)} - ${format(endTime)}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-black text-center mb-4">
       Class: {className} Timetable
      </h1>
      <table className="min-w-full table-auto border-collapse border border-gray-500">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border border-gray-500 text-center text-xl font-bold"></th>
            {daysOfWeek.map((day, index) => (
              <th
                key={index}
                className="px-4 py-2 border border-gray-500 text-gray-700 text-xl font-bold text-center"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Generate table rows without time slots, each subject in a block */}
          {timetable &&
            timetable[daysOfWeek[0]]?.map((_, rowIndex) => (
              <tr key={rowIndex} className="bg-white">
                <td className="px-4 py-2 border border-gray-500 text-center font-bold text-gray-800">
                  Period {rowIndex + 1}
                </td>
                {daysOfWeek.map((day) => (
                  <td key={day} className="border border-gray-500 text-center">
                    {timetable[day]?.[rowIndex] ? (
                      <div className="p-4 text-gray-900 bg-gray-100">
                        <p className="font-bold my-2">
                          {timetable[day][rowIndex].subject}
                        </p>
                        <p className="text-sm text-gray-600">
                          {timetable[day][rowIndex].teacher}
                        </p>
                        <p className="text-md font-semibold my-2">
                          {formatTime(timetable[day][rowIndex].time)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">No class</p>
                    )}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTablePrintClasswise;
