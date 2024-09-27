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
        <div className="grid grid-cols-6 gap-4">
          {daysOfWeek.map((day, dayIndex) => {
            const dayData = timetable?.find((entry) => entry._id === day);
            const periods = dayData ? dayData.periods : [];

            return (
              <div key={dayIndex} className="flex flex-col">
                <h2 className="text-xl font-bold mb-4 text-center">{day}</h2>
                <div className="flex flex-col gap-4">
                  {periods.length > 0 ? (
                    periods.map((periodData, index) => (
                      <div
                        key={index}
                        className="border border-gray-300 p-4 rounded-md bg-[#203046] text-white shadow-md transition-transform transform hover:scale-105"
                      >
                        {/* For Teacher Role */}
                        {userRole === "Teacher" ? (
                          <div className="flex-1">
                            <h3 className="font-bold text-lg flex items-center">
                              <AiOutlineUser className="mr-2 text-xl" />
                              {periodData.className}
                            </h3>
                            <p className="text-sm flex mt-2 items-center">
                              <AiOutlineBook className="mr-2 text-xl" />
                              {periodData.subject}
                            </p>
                            <p className="text-sm flex mt-2 items-center">
                              <AiOutlineClockCircle className="mr-2 text-xl" />
                              {formatTime(
                                periodData.startTime,
                                periodData.endTime
                              )}
                            </p>
                          </div>
                        ) : (
                          /* For Student or Parent Role */
                          <div className="flex-1">
                            <h3 className="font-bold text-lg flex items-center">
                              <AiOutlineBook className="mr-2 text-xl" />
                              {periodData.subject}
                            </h3>
                            <p className="text-sm flex mt-2 items-center">
                              <AiOutlineClockCircle className="mr-2 text-xl" />
                              {formatTime(
                                periodData.startTime,
                                periodData.endTime
                              )}
                            </p>
                            <p className="text-sm mt-2 flex items-center">
                              <AiOutlineUser className="mr-2 text-xl" />
                              {periodData.teacher}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400">
                      No classes scheduled.
                    </p>
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
