import React, { useEffect, useState } from "react";
import AttendenceSearchBar from "../common/SearchBar/AttendenceSearchBar";
import Datatable from "../common/Datatables/Datatable";
import { getAPI } from "../utility/api/apiCall";
import { jwtDecode } from "jwt-decode"; // Correctly import jwt-decode as a named import
import axios from "axios";

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
    render: (value, item) => {
      const attendanceValue = parseFloat(value);
      return (
        <div className="flex items-center">
          <span className="mr-2">{attendanceValue}%</span>
          <div className="relative w-full">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-600">
              <div
                style={{
                  width: `${attendanceValue}%`,
                  backgroundColor: item.color || "#4caf50", // Default color if item.color is undefined
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
  const [studentData, setStudentData] = useState([]); // Initialize as an empty array
  const [studentAttendance, setStudentAttendance] = useState([]);

  const handlePresent = (item) => {
    console.log(`Student with ID ${item._id} marked as Present`);
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token not found");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken);
      const newAttendance = {
        studentId: item._id,
        status: "Present",
        teacherId: decodedToken.id,
      };

      // Update the state using a function to access the current state correctly
      setStudentAttendance((prev) => {
        const updatedAttendance = [...prev, newAttendance];
        console.log("Updated Attendance:", updatedAttendance); // Log the updated state correctly
        return updatedAttendance;
      });
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const handleAbsent = (item) => {
    console.log(`Student with ID ${item._id} marked as Present`);
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token not found");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken);
      const newAttendance = {
        studentId: item._id,
        status: "Absent",
        teacherId: decodedToken.id,
      };

      // Update the state using a function to access the current state correctly
      setStudentAttendance((prev) => {
        const updatedAttendance = [...prev, newAttendance];
        console.log("Updated Attendance:", updatedAttendance); // Log the updated state correctly
        return updatedAttendance;
      });
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

    const handleSave = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/insert-student-attendance-in-bulk`, studentAttendance , {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            console.log("Data saved successfully:", response.data);
        }
        catch (error) {
            console.error("Error saving data:", error);
        }
    };


  const fetchData = async () => {
    try {
      const response = await getAPI("getAllStudents", {}, setStudentData);
      if (response) {
        setStudentData(response.data); // Assuming response.data contains the student array
        console.log("Data fetched successfully:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

return (
    <div className="">
        <AttendenceSearchBar />
        <Datatable
            columns={columns}
            data={studentData}
            actions={{ onPresent: handlePresent, onAbsent: handleAbsent }}
        />
        <div className="flex justify-end ">
            <button 
                onClick={handleSave}
                className="bg-[#283046] hover:bg-gray-900 hover:border border-[#65FA9E] text-[#65FA9E] font-bold py-1 px-6 rounded"
            >
                Save
            </button>
        </div>
    </div>
);
};

export default Attendence;
