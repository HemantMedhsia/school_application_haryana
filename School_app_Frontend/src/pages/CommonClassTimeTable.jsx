import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider.jsx";
import {
  AiOutlineClockCircle,
  AiOutlineBook,
  AiOutlineUser,
} from "react-icons/ai"; // Import icons

const CommonClassTimeTable = () => {
  const [timetable, setTimetable] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const { userRole, authToken } = useAuth();
  console.log(userRole);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        let endpoint = "";

        if (userRole === "Teacher") {
          endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/get-teacher-timetable`;
        } else if (userRole === "Student") {
          endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/get-student-timetable`;
        } else if (userRole === "Parent") {
          endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/get-studenttimetablebyparent`;
        }

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setTimetable(response.data.data);
        setShowTable(true);
      } catch (error) {
        console.error("Error fetching timetable:", error);
        setTimetable(null);
        setShowTable(false);
      }
    };

    fetchTimetable();
  }, [userRole]);

  const formatTime = (startTime, endTime) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    const formattedStart = new Date(startTime).toLocaleTimeString([], options);
    const formattedEnd = new Date(endTime).toLocaleTimeString([], options);
    return `${formattedStart} - ${formattedEnd}`;
  };

  return (
<div className="mt-6">
  {showTable ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {daysOfWeek.map((day, dayIndex) => {
        const dayData = timetable?.find((entry) => entry._id === day);
        const periods = dayData ? dayData.periods : [];

        return (
          <div key={dayIndex} className="flex flex-col">
            <h2 className="text-xl text-[#7367F0] font-bold mb-4 sm:mb-6 text-center">
              {day}
            </h2>
            <div className="flex flex-col gap-4">
              {periods.length > 0 ? (
                periods.map((periodData, index) => (
                  <div
                    key={index}
                    className="shadow-[#7367F0] hover:shadow-[#65FA9E] duration-300 hover:translate-y-2 shadow-md p-3 sm:p-4 rounded-md text-[#65FA9E]"
                  >
                    {/* For Teacher Role */}
                    {userRole === "Teacher" ? (
                      <div className="flex-1">
                        <h3 className="font-bold text-md sm:text-lg flex items-center">
                          <AiOutlineUser className="mr-1 text-lg sm:text-xl" />
                          Class: {periodData.className}
                        </h3>
                        <p className="text-sm flex mt-2 items-center">
                          <AiOutlineBook className="mr-1 text-lg sm:text-xl" />
                          {periodData.subject}
                        </p>
                        <p className="text-sm text-red-400 flex mt-2 items-center">
                          <AiOutlineClockCircle className="mr-1 text-lg sm:text-xl" />
                          {formatTime(periodData.startTime, periodData.endTime)}
                        </p>
                      </div>
                    ) : (
                      /* For Student or Parent Role */
                      <div className="flex-1">
                        <h3 className="font-bold text-md sm:text-lg flex items-center">
                          <AiOutlineBook className="mr-2 text-lg sm:text-xl" />
                          {periodData.subject}
                        </h3>
                        <p className="text-sm text-red-400 flex mt-2 items-center">
                          <AiOutlineClockCircle className="mr-2 text-lg sm:text-xl" />
                          {formatTime(periodData.startTime, periodData.endTime)}
                        </p>
                        <p className="text-sm mt-2 flex items-center">
                          <AiOutlineUser className="mr-2 text-lg sm:text-xl" />
                          {periodData.teacher}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">No classes scheduled.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-center text-red-500">
      Loading timetable or no data available.
    </p>
  )}
</div>

  );
};

export default CommonClassTimeTable;
