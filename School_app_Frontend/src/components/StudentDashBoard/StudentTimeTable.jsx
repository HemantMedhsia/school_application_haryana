import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import { ToastContainer, toast } from "react-toastify";

const StudentTimeTable = () => {
  const [timetableData, setTimetableData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { userRole } = useAuth();

  const fetchTimetableForDay = async (day) => {
    setLoading(true);
    setError("");
    let endpoint = "";
    if (userRole === "Student") {
      endpoint = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/get-student-timetable-daywise?dayOfWeek=${day}`;
    } else if (userRole === "Parent") {
      endpoint = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/get-student-timetable-daywise-by-parent?dayOfWeek=${day}`;
    } else if (userRole === "Teacher") {
      endpoint = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/get-teacher-timetable-daywise?dayOfWeek=${day}`;
    }

    try {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (response.data.success) {
        if (response.data.data.length === 0) {
          toast.info(`No timetable found for ${day}.`);
        } else {
          setSelectedDay(response.data.data[0]);
        }
      } else {
        setError("Failed to fetch timetable");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error("No timetable found for this day.");
      } else {
        toast.error("Error fetching timetable.");
      }
    } finally {
      setLoading(false);
    }
  };

  const openTimetable = (day) => {
    fetchTimetableForDay(day);
  };

  const closeTimetable = () => {
    setSelectedDay(null);
  };

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="w-full mx-auto p-6 shadow-md rounded-md bg-gray-900 text-gray-100">
      <h1 className="text-2xl font-bold text-center text-[#7367F0] mb-6">
        Timetable
      </h1>
      <div className="grid grid-cols-1 gap-4">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            className="p-4 bg-gradient-to-r from-[#65FA9E] text-lg to-[#7367F0] text-white rounded-md shadow hover:from-purple-600 hover:to-indigo-700 transition"
            onClick={() => openTimetable(day)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Modal for showing selected day's schedule */}
      {loading && <p className="text-center text-gray-100 mt-6">Loading...</p>}
      {error && <p className="text-center text-red-500 mt-6">{error}</p>}

      {selectedDay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded-md shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">
              {selectedDay._id} Schedule
            </h2>
            <ul className="space-y-3">
              {selectedDay.periods.map((period, index) => (
                <li
                  key={index}
                  className="p-3 bg-gray-700 rounded shadow flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-medium text-gray-100">
                      {new Date(period.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(period.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-gray-300">
                      {period.subject} -{" "}
                      {userRole === "Teacher"
                        ? period.className
                        : period.teacher}
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
      <ToastContainer />
    </div>
  );
};

export default StudentTimeTable;
