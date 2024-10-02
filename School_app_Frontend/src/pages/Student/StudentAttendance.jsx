import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Basic calendar styles
import "./CustomCalendar.css"; // Import your custom styles
import axios from "axios";
import { getAPI } from "../../utility/api/apiCall";
import { useAuth } from "../../context/AuthProvider";
import { useParams } from "react-router-dom";

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState({});
  const { userRole } = useAuth();
  const {studentId} = useParams();

  const fetchAttendance = async () => {
    if (userRole === "Student") {
      getAPI("overallAttendanceStudent", {}, setAttendance);
    } else if (userRole === "Parent") {
      getAPI("overallAttendanceParent", {}, setAttendance);
    }
  };
  fetchAttendance();
  console.log(attendance);

  const fetchParticularAttendance = async (studentId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-student-attendance-bystudentid-admin/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, 
        },
      });
      console.log("Fetched particular attendance for student:", response.data.data);
      setAttendance(response.data.data);
    }
    catch(err) {
      console.error("Error fetching particular attendance for student:", err);
    }
  }

  useEffect(() => {
   studentId ? fetchParticularAttendance(studentId) : fetchAttendance();
  }, [userRole]);

  const [date, setDate] = useState(new Date(Date.UTC(2024, 9, 2))); // Month is zero-indexed, so 9 = October

  const tileContent = ({ date, view }) => {
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    console.log(`Checking date: ${formattedDate}`); // Debugging line
    const status = attendance[formattedDate];

    if (view === "month" && status) {
      return (
        <div
          className={`text-xs flex flex-col rounded-full mx-2 px-3 py-1 font-semibold text-center ${
            status === "Present"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {status}
        </div>
      );
    }
    return null;
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const formattedDate = `${newDate.getFullYear()}-${(newDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${newDate.getDate().toString().padStart(2, "0")}`;
    console.log(`Selected date: ${formattedDate}`);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full h-full lg:w-full p-1 bg-[#283046] rounded-md shadow-lg">
        <Calendar
          value={date}
          onChange={handleDateChange}
          tileContent={tileContent}
          className="custom-calendar pt-4 px-2 bg-gray-900 border w-full h-full border-[#65fa9e] rounded-md"
        />
      </div>
    </div>
  );
};

export default StudentAttendance;
