import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider.jsx";

const CommonClassTimeTable = () => {
  const [timetable, setTimetable] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const { userRole } = useAuth();

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        let endpoint = "";

        if (userRole === "Teacher") {
          endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/get-teacher-timetable`;
        } else if (userRole === "Student" || userRole === "Parent") {
          endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/get-student-timetable`;
        }

        const response = await axios.get(endpoint);
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
        <div className="flex flex-wrap gap-8">
          {daysOfWeek.map((day, dayIndex) => {
            const dayData = timetable?.find((entry) => entry._id === day);
            const periods = dayData ? dayData.periods : [];

            return (
              <div key={dayIndex} className="flex-1">
                <h2 className="text-xl font-bold mb-4 text-center">{day}</h2>
                <div className="flex flex-col gap-4">
                  {periods.length > 0 ? (
                    periods.map((periodData, index) => (
                      <div
                        key={index}
                        className="border border-gray-300 p-4 rounded-md bg-[#203046] text-white"
                      >
                        <h3 className="font-bold text-lg">
                          {userRole === "Teacher" ? periodData.subject : periodData.className}
                        </h3>
                        <p className="text-sm">{formatTime(periodData.startTime, periodData.endTime)}</p>
                        {userRole === "Student" || userRole === "Parent" ? (
                          <p className="text-sm">Subject: {periodData.subject}</p>
                        ) : (
                          <p className="text-sm">Class: {periodData.className}</p>
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
        <p className="text-center text-red-500">Loading timetable or no data available.</p>
      )}
    </div>
  );
};

export default CommonClassTimeTable;
