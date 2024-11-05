import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CustomCalendar.css";
import axios from "axios";
import { getAPI } from "../../utility/api/apiCall";
import { useAuth } from "../../context/AuthProvider";
import { useParams } from "react-router-dom";
import { FaTimes, FaSave } from "react-icons/fa"; // Icons for close and save
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState(null); // Set to null initially
  const [id, setid] = useState(null);
  const [roleAdmin, setRoleAdmin] = useState(false);
  const { userRole } = useAuth();
  const { studentId, teacherId, staffId } = useParams();
  const [endpoint, setEndpoint] = useState(null);
  const [updateEndpoint, setUpdateEndpoint] = useState(null);

  const fetchAttendance = async () => {
    try {
      if (userRole === "Student") {
        getAPI("overallAttendanceStudent", {}, setAttendance);
      } else if (userRole === "Parent") {
        getAPI("overallAttendanceParent", {}, setAttendance);
      } else if (userRole === "Teacher") {
        getAPI("overallAttendanceTeacher", {}, setAttendance);
      } else if (userRole === "Admin") {
        setRoleAdmin(true);
      }
    } catch (err) {
      toast.error("Failed to fetch attendance!");
      console.error(err);
    }
  };

  const fetchParticularAttendance = async (id, ep) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/${ep}/${id}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setAttendance(response.data.data);
      setRoleAdmin(true);
    } catch (err) {
      toast.error("Failed to fetch specific attendance.");
      console.error("Error fetching particular attendance for student:", err);
    }
  };

  useEffect(() => {
    if (studentId) {
      setid(studentId);
      setEndpoint("get-student-attendance-bystudentid-admin");
      setUpdateEndpoint("update-student-attendance-admin");
    } else if (teacherId) {
      setid(teacherId);
      setEndpoint("get-teacher-attendance-byadmin");
      setUpdateEndpoint("update-teacher-attendance-byadmin");
    } else if (staffId) {
      setid(staffId);
      setEndpoint("get-staff-attendance-byadmin");
      setUpdateEndpoint("update-staff-attendance-byadmin");
    } else {
      setid(null);
      setEndpoint(null);
      setUpdateEndpoint(null);
    }
  }, [studentId, teacherId, staffId]);

  useEffect(() => {
    const fetchData = async () => {
      if (id && endpoint) {
        await fetchParticularAttendance(id, endpoint);
      } else {
        await fetchAttendance();
      }
    };

    fetchData();
  }, [id, endpoint, userRole]);

  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const formattedDate = `${newDate.getFullYear()}-${(newDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${newDate.getDate().toString().padStart(2, "0")}`;
    const status = attendance[formattedDate];

    setSelectedDate(formattedDate);
    setAttendanceStatus(status || null); // Keep null if there's no attendance
    setShowModal(true);
  };

  const updateAttendanceStatus = async (id, uep) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/${uep}/${id}`;
    try {
      await axios.put(
        url,
        {
          date: selectedDate,
          status: attendanceStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setAttendance({
        ...attendance,
        [selectedDate]: attendanceStatus,
      });
      toast.success("Attendance updated successfully!"); // Success toast
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to update attendance."); // Error toast
      console.error("Error updating attendance:", err);
    }
  };

  const tileContent = ({ date, view }) => {
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
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

      {showModal && roleAdmin && (
        <div className="fixed inset-0 bg-[#7367f0] bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg relative w-[400px] text-white">
            <h2 className="text-xl font-bold mb-4 text-[#7367f0]">
              Attendance Details
            </h2>
            <p className="mb-4 text-red-500">Date: {selectedDate}</p>
            {attendanceStatus === null ? (
              <p className="text-gray-400">
                Oops!! No attendance available for this date.
              </p>
            ) : (
              <div className="my-4">
                <label className="block mb-2 text-sm font-semibold text-gray-300">
                  Status:
                </label>
                <select
                  value={attendanceStatus}
                  onChange={(e) => setAttendanceStatus(e.target.value)}
                  className="w-full p-2 bg-gray-800 text-gray-300 border border-[#65fa9e] rounded-lg shadow-sm focus:ring-2 focus:ring-[#65fa9e] transition-all duration-300 ease-in-out hover:border-blue-400 hover:shadow-md"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
            )}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="text-xs flex flex-col rounded-full mx-2 px-3 py-1 font-semibold text-center hover:bg-red-400 bg-red-500 text-white transition duration-200"
              >
                Close
              </button>
              {attendanceStatus !== null && (
                <button
                  onClick={() => updateAttendanceStatus(id, updateEndpoint)} // Updated here
                  className="text-xs flex flex-col rounded-full mx-2 px-3 py-1 font-semibold text-center transition bg-green-500 text-white duration-200"
                >
                  Update
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast notification container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default StudentAttendance;
