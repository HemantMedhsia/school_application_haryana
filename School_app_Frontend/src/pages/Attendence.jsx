import React, { useEffect, useState } from "react";
import AttendenceSearchBar from "../common/SearchBar/AttendenceSearchBar";
import Datatable from "../common/Datatables/Datatable";
import { getAPI } from "../utility/api/apiCall";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Import toast

const columns = [
  {
    header: "First Name",
    accessor: "firstName",
  },
  {
    header: "Last Name",
    accessor: "lastName",
  },
  {
    header: "Roll Number",
    accessor: "rollNumber",
  },
  {
    header: "Attendance Percentage",
    accessor: "attendancePercentage",
    render: (value) => {
      const attendanceValue = parseFloat(value);
      return (
        <div className="flex items-center">
          <span className="mr-2">{attendanceValue}%</span>
          <div className="relative w-full">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-600">
              <div
                style={{
                  width: `${attendanceValue}%`,
                  backgroundColor: "#4caf50",
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
              ></div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    header: "Age",
    accessor: "age",
  },
];

const Attendence = () => {
  const [studentData, setStudentData] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});

  const handleAttendance = (item, status) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token not found");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const newAttendance = {
        studentId: item._id,
        status,
        date: new Date().toISOString(),
        teacherId: decodedToken.id,
      };

      setAttendanceStatus((prev) => ({
        ...prev,
        [item._id]: status,
      }));

      setStudentAttendance((prev) => {
        const existingIndex = prev.findIndex(
          (att) => att.studentId === item._id
        );
        if (existingIndex !== -1) {
          const updatedAttendance = [...prev];
          updatedAttendance[existingIndex] = newAttendance;
          return updatedAttendance;
        } else {
          return [...prev, newAttendance];
        }
      });

      console.log(`Student with ID ${item._id} marked as ${status}`);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/insert-student-attendance-in-bulk`,
        studentAttendance,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Data saved successfully!"); // Success toast
      console.log("Attendance marked/saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving data:", error);
      if (
        error.response.status === 401 &&
        error.response.data.AttendenceErr === true
      ) {
        return toast.error(error.response.data.message); // Error toast
      }
      toast.error("Error saving data!");
    }
  };

  const fetchData = async () => {
    try {
      const response = await getAPI("getAllStudents", {}, setStudentData);
      if (response) {
        setStudentData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching student data!"); // Error toast
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <AttendenceSearchBar />
      <Datatable
        columns={columns}
        data={studentData}
        actions={{
          onPresent: (item) => handleAttendance(item, "Present"),
          onAbsent: (item) => handleAttendance(item, "Absent"),
        }}
        attendanceStatus={attendanceStatus}
      />
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-[#283046] hover:bg-gray-900 hover:border border-[#65FA9E] text-[#65FA9E] font-bold py-1 px-6 rounded"
        >
          Save
        </button>
      </div>
      <ToastContainer /> {/* Toast container to display notifications */}
    </div>
  );
};

export default Attendence;
