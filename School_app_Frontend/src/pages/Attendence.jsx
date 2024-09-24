import React, { useEffect, useState } from "react";
import AttendenceSearchBar from "../common/SearchBar/AttendenceSearchBar";
import Datatable from "../common/Datatables/Datatable";
import { getAPI } from "../utility/api/apiCall";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const columns = [
  { header: "First Name", accessor: "firstName" },
  { header: "Last Name", accessor: "lastName" },
  { header: "Roll Number", accessor: "rollNumber" },
  { header: "Total Classes", accessor: "total" },
  { header: "Total Present", accessor: "present" },
  { header: "Total Absent", accessor: "absent" },
  {
    header: "Attendance Percentage",
    accessor: "attendancePercentage", // Corrected the field name
    render: (rowData) => {
      const attendanceValue = parseFloat(rowData.attendancePercentage); // Using the correct field
      return (
        <div className="flex items-center">
          <span className="mr-2">{attendanceValue}%</span>
          <div className="relative w-full">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
              <div
                style={{
                  width: `${attendanceValue}%`,
                  backgroundColor:
                    attendanceValue >= 90
                      ? "#00e676" // Bright green for 90% and above
                      : attendanceValue >= 80
                      ? "#66bb6a" // Green for 80% to 89%
                      : attendanceValue >= 70
                      ? "#ffeb3b" // Yellow for 70% to 79%
                      : attendanceValue >= 60
                      ? "#ffa726" // Orange for 60% to 69%
                      : attendanceValue >= 50
                      ? "#ff7043" // Dark orange for 50% to 59%
                      : "#f44336", // Red for below 50%
                }}
                className="h-2 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
              />
            </div>
          </div>
        </div>
      );
    },
  },
];

const Attendence = () => {
  const [studentData, setStudentData] = useState([]);
  const [filteredStudentData, setFilteredStudentData] = useState([]); // Use this for displaying filtered data
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [classItems, setClassItems] = useState([]);
  const [sectionItems, setSectionItems] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchDropdownData = async () => {
    try {
      await getAPI("getAllClasses", {}, setClassItems);
      await getAPI("getAllSections", {}, setSectionItems);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const handleFilter = ({ type, value }) => {
    let filteredData = studentData;

    if (type === "class" && value) {
      setSelectedClass(value); // Store selected class
      filteredData = filteredData.filter(
        (student) => student.currentClass._id === value._id
      );
    } else if (type === "section" && value && selectedClass) {
      // Check if a class is selected
      filteredData = filteredData.filter(
        (student) => student.currentSection._id === value._id
      );
    }

    if (searchText) {
      filteredData = filteredData.filter((student) => {
        const fullName =
          `${student.firstName} ${student.lastName}`.toLowerCase();
        return (
          fullName.includes(searchText.toLowerCase()) ||
          student.rollNumber.toLowerCase().includes(searchText.toLowerCase())
        );
      });
    }

    setFilteredStudentData(filteredData);
  };

  // Trigger filter whenever search text changes
  const handleSearch = (searchText) => {
    setSearchText(searchText);
    handleFilter({});
  };

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
      toast.success("Data saved successfully!");
      fetchData();
      console.log("Attendance marked/saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving data:", error);
      if (
        error.response.status === 400 &&
        error.response.data.AttendenceErr === true
      ) {
        return toast.error(error.response.data.message);
      }
      toast.error("Error saving data!");
    }
  };

  const fetchData = async (filters = {}) => {
    try {
      const params = {
        ...filters,
      };
      const response = await getAPI("getAllStudents", params, setStudentData);
      // if (response) {
      //   setStudentData(response.data);
      //   setFilteredStudentData(response.data); // Set filtered data initially
      // }

      if (response.data && Array.isArray(response.data)) {
        console.log("Fetching student attendance summaries...");

        // Use Promise.all to handle the asynchronous calls inside map
        const updatedResponse = await Promise.all(
          response.data.map(async (student) => {
            try {
              const { data } = await axios.get(
                `${
                  import.meta.env.VITE_BACKEND_URL
                }/api/get-student-attendance-summary/${student._id}`
              );

              console.log("data", data.data.percentage);

              const attendancePercentage = data?.data?.percentage || 99;
              const present = data?.data?.present || 0;
              const absent = data?.data?.absent || 0;
              const total = data?.data?.total || 0;
              return {
                ...student,
                attendancePercentage: attendancePercentage,
                present: present,
                absent: absent,
                total: total,
                grade: "A", // Example grade
              };
            } catch (error) {
              console.error(
                `Error fetching attendance for student ${student._id}:`,
                error
              );
              return {
                ...student,
                attendancePercentage: 89, // Default in case of error
                grade: "A", // Example grade
              };
            }
          })
        );

        console.log(
          "Updated student data with attendance percentage:",
          updatedResponse
        );
        setStudentData(updatedResponse);
        setFilteredStudentData(updatedResponse);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching student data!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <AttendenceSearchBar
        classItems={classItems}
        sectionItems={sectionItems}
        onFilter={handleFilter}
        onSearch={handleSearch}
      />
      <Datatable
        columns={columns}
        data={filteredStudentData} // Use filtered data here
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
      <ToastContainer />
    </div>
  );
};

export default Attendence;
