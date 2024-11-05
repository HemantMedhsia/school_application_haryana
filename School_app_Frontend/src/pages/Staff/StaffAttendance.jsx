import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAPI } from "../../utility/api/apiCall";
import AttendenceSearchBar from "../../common/SearchBar/AttendenceSearchBar";
import Datatable from "../../common/Datatables/Datatable";
import StaffAttendanceSearchBar from "../../components/StaffAttendanceSearchBar/StaffAttendanceSearchBar";

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Position", accessor: "type" },
  { header: "Days", accessor: "total" },
  { header: "Present", accessor: "present" },
  { header: "Absent", accessor: "absent" },
  {
    header: "Attendance Percentage",
    accessor: "attendancePercentage",
    render: (rowData) => {
      const attendanceValue = parseFloat(rowData.attendancePercentage);
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
                      ? "#00e676"
                      : attendanceValue >= 80
                      ? "#66bb6a"
                      : attendanceValue >= 70
                      ? "#ffeb3b"
                      : attendanceValue >= 60
                      ? "#ffa726"
                      : attendanceValue >= 50
                      ? "#ff7043"
                      : "#f44336",
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

const StaffAttendance = () => {
  const [staffData, setStaffData] = useState([]);
  const [filteredStaffData, setFilteredStaffData] = useState([]);
  const [staffAttendance, setStaffAttendance] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false); // Loader state
  const navigate = useNavigate();

  const fetchStaffData = async () => {
    setLoading(true); // Start loading
    try {
      const response = await getAPI("getAllStaff", {}, setStaffData);
      console.log("response", response);

      if (response.data && Array.isArray(response.data)) {
        const updatedResponse = await Promise.all(
          response.data.map(async (staff) => {
            try {
              const { data } = await axios.get(
                `${
                  import.meta.env.VITE_BACKEND_URL
                }/api/get-staff-attendance-summary/${staff._id}`
              );

              const attendancePercentage = data?.data?.percentage || 100;
              const present = data?.data?.present || 0;
              const absent = data?.data?.absent || 0;
              const total = data?.data?.total || 0;
              return {
                ...staff,
                attendancePercentage: attendancePercentage,
                present: present,
                absent: absent,
                total: total,
              };
            } catch (error) {
              console.error(
                `Error fetching attendance for staff ${staff._id}:`,
                error
              );
              return {
                ...staff,
                attendancePercentage: 0,
              };
            }
          })
        );

        setStaffData(updatedResponse);
        setFilteredStaffData(updatedResponse);
      }
    } catch (error) {
      console.error("Error fetching staff data:", error);
      toast.error("Error fetching staff data!");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSearch = (searchText) => {
    setSearchText(searchText);
    const filteredData = staffData.filter((staff) => {
      const fullName = `${staff.name}`.toLowerCase();
      return (
        fullName.includes(searchText.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setFilteredStaffData(filteredData);
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
        staffId: item._id,
        status,
        date: new Date().toISOString(),
        adminId: decodedToken.id,
      };

      setAttendanceStatus((prev) => ({
        ...prev,
        [item._id]: status,
      }));

      setStaffAttendance((prev) => {
        const existingIndex = prev.findIndex((att) => att.staffId === item._id);
        if (existingIndex !== -1) {
          const updatedAttendance = [...prev];
          updatedAttendance[existingIndex] = newAttendance;
          return updatedAttendance;
        } else {
          return [...prev, newAttendance];
        }
      });

      console.log(`Staff with ID ${item._id} marked as ${status}`);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/create-multiple-attendance-staff`,
        staffAttendance,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Attendance data saved successfully!");
      fetchStaffData();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.data) {
        toast.error(error.response.data.data);
      } else {
        toast.error("Error saving data!");
      }
      console.error("Error saving attendance data:", error);
    }
  };

  const handleView = async (item) => {
    navigate(`/school/staff-attendance-view/${item._id}`);
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  return (
    <div>
      <StaffAttendanceSearchBar
        onSearch={handleSearch}
        placeholder="Search by staff name or employee ID"
      />
      {loading ? (
        <div className="loader-wrapper">
          <span className="loader"></span>
        </div>
      ) : filteredStaffData.length === 0 ? (
        <div className="no-data-message text-xl flex justify-center text-red-500">
          Oops! No Staff Attendance Records Found.
        </div>
      ) : (
        <Datatable
          columns={columns}
          data={filteredStaffData}
          actions={{
            onView: (item) => handleView(item),
            onPresent: (item) => handleAttendance(item, "Present"),
            onAbsent: (item) => handleAttendance(item, "Absent"),
          }}
          attendanceStatus={attendanceStatus}
        />
      )}
      {staffAttendance.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-[#283046] hover:bg-gray-900 hover:border border-[#65FA9E] text-[#65FA9E] font-bold py-1 px-6 rounded"
          >
            Save
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default StaffAttendance;
