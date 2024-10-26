import React, { useEffect, useState } from "react";
import Datatable from "../../common/Datatables/Datatable";
import SearchBar from "../../common/SearchBar/SearchBar";
import { deleteAPI, getAPI } from "../../utility/api/apiCall";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/ConfirmationModal/ConfirmationModal";
import DetailsSelectionModal from "../../common/ConfirmationModal/DetailsSelectionModal";
import StudentSearchPopup from "./StudentPopup"; // Import the new popup component
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const StudentInfo = () => {
  const [allStudentData, setAllStudentData] = useState([]);
  const [updatedAllStudentdata, setUpdatedAllStudentdata] = useState([]);
  const [filteredStudentData, setFilteredStudentData] = useState([]);
  const [classItems, setClassItems] = useState([]);
  const [sectionItems, setSectionItems] = useState([]);
  const [sessionItems, setSessionItems] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStudentSearchOpen, setIsStudentSearchOpen] = useState(false); // State for the popup
  const [currentStudentId, setCurrentStudentId] = useState(null); // State for current student ID
  const [currentParentId, setCurrentParentId] = useState(null); // State for current parent ID
  const [siblingsData, setSiblingsData] = useState([]); // State for siblings data
  const [isSiblingsModalOpen, setIsSiblingsModalOpen] = useState(false); // State for siblings modal
  const navigate = useNavigate();

  const fetchDropdownData = async () => {
    try {
      await getAPI("getAllClasses", {}, setClassItems);
      await getAPI("getAllSections", {}, setSectionItems);
      await getAPI("getAllSessions", {}, setSessionItems);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAPI("getAllStudents", {}, setAllStudentData);

      if (response.data && Array.isArray(response.data)) {
        const updatedResponse = await Promise.all(
          response.data.map(async (student) => {
            try {
              const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/get-student-attendance-summary/${student._id}`
              );

              const attendancePercentage = data?.data?.percentage;
              return {
                ...student,
                attendancePercentage: attendancePercentage,
                grade: "A", // Example grade
              };
            } catch (error) {
              console.error(
                `Error fetching attendance for student ${student._id}:`,
                error
              );
              return {
                ...student,
                attendancePercentage: 0, // Default in case of error
                grade: "A", // Example grade
              };
            }
          })
        );

        setAllStudentData(updatedResponse);
        setFilteredStudentData(updatedResponse);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter logic
  const handleFilter = ({ type, value }) => {
    let filteredData = allStudentData;

    if (type === "class" && value) {
      setSelectedClass(value);
      filteredData = filteredData.filter(
        (student) => student.currentClass._id === value._id
      );
    } else if (type === "section" && value && selectedClass) {
      filteredData = filteredData.filter(
        (student) => student.currentSection._id === value._id
      );
    } else if (type === "session" && value) {
      filteredData = filteredData.filter(
        (student) => student.currentSession._id === value._id
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

  const handleDetailsSelect = (type) => {
    if (type === "student") {
      navigate(`/school/student-admission/${selectedStudent._id}`);
    } else if (type === "parent") {
      navigate(`/school/parent-update-student/${selectedStudent._id}`);
    }
  };

  const closeDetailsModal = () => {
    setSelectedStudent(null);
    setIsDetailsModalOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (searchText) => {
    setSearchText(searchText);
    handleFilter({});
  };

  const columns = [
    { header: "First Name", accessor: "firstName" },
    { header: "Last Name", accessor: "lastName" },
    { header: "Roll Number", accessor: "rollNumber" },
    { header: "Age", accessor: "age" },
    {
      header: "Father Name",
      accessor: (rowData) => rowData?.parent?.fatherName || "N/A",
    },
    {
      header: "Class",
      accessor: (rowData) => rowData?.currentClass?.name || "N/A",
    },
    {
      header: "Section",
      accessor: (rowData) => rowData?.currentSection?.name || "N/A",
    },
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

  const handleCustomAction = (studentData) => {
    setCurrentStudentId(studentData._id); // Set the current student ID
    setCurrentParentId(studentData.parent); // Set the current parent ID (assume parentId is available in studentData)
    setIsStudentSearchOpen(true); // Open the popup for custom action
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      try {
        await deleteAPI(`delete-student/${studentToDelete._id}`);

        setAllStudentData((prevData) =>
          prevData.filter((student) => student._id !== studentToDelete._id)
        );
        setFilteredStudentData((prevData) =>
          prevData.filter((student) => student._id !== studentToDelete._id)
        );

        toast.success(
          `${studentToDelete.firstName} has been deleted successfully`
        );
      } catch (error) {
        console.error("Error deleting student:", error);
        toast.error("Failed to delete the student.");
      } finally {
        setIsModalOpen(false);
        setStudentToDelete(null);
      }
    }
  };

  const handleAddStudent = (student) => {
    console.log("Student added:", student);
    toast.success(`Added successfully.`);
    setIsStudentSearchOpen(false); // Close the popup after adding
  };

  const handleViewSiblings = async (studentData) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-sibling-group-studentid/${studentData._id}`
      );
      if (response.status === 200) {
        setSiblingsData(response.data.data);
        setIsSiblingsModalOpen(true); // Open the modal with siblings data
      } else {
        toast.error("Failed to fetch siblings.");
      }
    } catch (error) {
      console.error("Error fetching siblings:", error);
      toast.error("Failed to fetch siblings.");
    }
  };

  return (
    <div>
      <SearchBar
        classItems={classItems}
        sectionItems={sectionItems}
        sessionItems={sessionItems}
        onFilter={handleFilter}
        onSearch={handleSearch}
      />
      {loading ? (
        <div className="loader-wrapper">
          <span className="loader"></span>
        </div>
      ) : filteredStudentData.length === 0 ? (
        <div className="no-data-message text-xl flex justify-center text-red-500">
          Oops! No Students Records Found.
        </div>
      ) : (
        <Datatable
          data={filteredStudentData}
          columns={columns}
          actions={{
            onView: handleView,
            onEdit: handleEdit,
            onDelete: handleDelete,
            onCustomAction: handleCustomAction,
            onViewSibblings: handleViewSiblings,
          }}
        />
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete ${
          studentToDelete ? studentToDelete.firstName : ""
        }?`}
      />
      <DetailsSelectionModal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        onSelect={handleDetailsSelect}
      />
      <StudentSearchPopup
        isOpen={isStudentSearchOpen}
        onClose={() => setIsStudentSearchOpen(false)}
        onAddStudent={handleAddStudent}
        studentId={currentStudentId}
        parent={currentParentId}
      />
      <SiblingModal
        isOpen={isSiblingsModalOpen}
        onClose={() => setIsSiblingsModalOpen(false)}
        siblings={siblingsData}
      />
      <ToastContainer />
    </div>
  );
};

const SiblingModal = ({ isOpen, onClose, siblings }) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${
        isOpen ? "" : "hidden"
      }`}
      style={{ zIndex: 1000 }}
    >
      <div className="bg-white p-8 rounded-lg w-4/5 max-h-[85%] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Siblings</h2>
          <button onClick={onClose} className="text-red-500 text-xl font-bold">
            &times;
          </button>
        </div>
        {siblings.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">No siblings found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siblings.map((sibling) => (
              <div
                key={sibling._id}
                className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={sibling.studentPhoto || "default-image-url.jpg"}
                  alt={`${sibling.firstName} ${sibling.lastName}`}
                  className="w-full h-32 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-700">
                  {`${sibling.firstName} ${sibling.lastName}`}
                </h3>
                <p className="text-gray-500 text-sm">Class: {sibling.currentClass.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentInfo;
