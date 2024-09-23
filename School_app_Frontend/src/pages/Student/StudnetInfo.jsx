import React, { useEffect, useState } from "react";
import Datatable from "../../common/Datatables/Datatable";
import SearchBar from "../../common/SearchBar/SearchBar";
import { deleteAPI, getAPI } from "../../utility/api/apiCall";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/ConfirmationModal/ConfirmationModal";
import DetailsSelectionModal from "../../common/ConfirmationModal/DetailsSelectionModal";

const StudentInfo = () => {
  const [allStudentData, setAllStudentData] = useState([]);
  const [filteredStudentData, setFilteredStudentData] = useState([]);
  const [classItems, setClassItems] = useState([]);
  const [sectionItems, setSectionItems] = useState([]);
  const [sessionItems, setSessionItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  const fetchDropdownData = async () => {
    try {
      const classes = await getAPI("getAllClasses", {}, setClassItems);
      const sections = await getAPI("getAllSections", {}, setSectionItems);
      const sessions = await getAPI("getAllSessions", {}, setSessionItems);
      console.log(sessionItems)
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getAPI("getAllStudents", {}, setAllStudentData);
      if (response && Array.isArray(response)) {
        setAllStudentData(response);
        setFilteredStudentData(response); // Initialize filtered data
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFilter = ({ type, value }) => {
    let filteredData = allStudentData;

    if (type === "class" && value) {
      filteredData = filteredData.filter(student => student.currentClass._id === value._id);
    } else if (type === "section" && value) {
      filteredData = filteredData.filter(student => student.currentSection._id === value._id);
    } else if (type === "session" && value) {
      filteredData = filteredData.filter(student => student.session._id === value._id);
    }

    setFilteredStudentData(filteredData); // Update the filtered student data
  };

  const columns = [
    { header: "First Name", accessor: "firstName" },
    { header: "Last Name", accessor: "lastName" },
    { header: "Roll Number", accessor: "rollNumber" },
    { header: "Age", accessor: "age" },
    { header: "Father Name", accessor: (rowData) => rowData?.parent?.fatherName || "N/A" },
    { header: "Class", accessor: (rowData) => rowData?.currentClass?.name || "N/A" },
    { header: "Section", accessor: (rowData) => rowData?.currentSection?.name || "N/A" },
    {
      header: "Attendance Percentage",
      accessor: "attendance",
      render: (rowData) => {
        const attendanceValue = parseFloat(rowData.attendance);
        return (
          <div className="flex items-center">
            <span className="mr-2">{attendanceValue}%</span>
            <div className="relative w-full">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-300">
                <div
                  style={{
                    width: `${attendanceValue}%`,
                    backgroundColor: attendanceValue >= 75 ? "#4caf50" : "#ff5252",
                  }}
                  className="h-2 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                />
              </div>
            </div>
          </div>
        );
      },
    },
    { header: "Grade", accessor: "grade" },
  ];

  const handleEdit = (studentData) => {
    setSelectedStudent(studentData);
    setIsDetailsModalOpen(true);
  };

  const handleView = (studentData) => {
    navigate(`/school/profile/${studentData._id}`);
  };

  const handleDelete = (studentData) => {
    setStudentToDelete(studentData);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      console.log("Deleting student:", studentToDelete);
      try {
        await deleteAPI(`delete-student/${studentToDelete._id}`);
        fetchData(); // Refresh the student data
      } catch (error) {
        console.error("Error deleting student:", error);
      } finally {
        setIsModalOpen(false);
        setStudentToDelete(null);
      }
    }
  };

  const openModal = (studentData) => {
    setStudentToDelete(studentData);
    setIsModalOpen(true);
  };

  return (
    <div className="">
      <SearchBar
        classItems={classItems}
        sectionItems={sectionItems}
        sessionItems={sessionItems}
        onFilter={handleFilter} // Pass filter function
      />
      <Datatable
        data={filteredStudentData}
        columns={columns}
        actions={{
          onView: handleView,
          onEdit: handleEdit,
          onDelete: openModal,
        }}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete ${studentToDelete ? studentToDelete.firstName : ""}?`}
      />
      <DetailsSelectionModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
};

export default StudentInfo;
