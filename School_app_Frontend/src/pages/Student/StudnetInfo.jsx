import React, { useEffect, useState } from "react";
import Datatable from "../../common/Datatables/Datatable";
import SearchBar from "../../common/SearchBar/SearchBar";
import { deleteAPI, getAPI } from "../../utility/api/apiCall";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/ConfirmationModal/ConfirmationModal";
import DetailsSelectionModal from "../../common/ConfirmationModal/DetailsSelectionModal";
import StudentSearchPopup from "./StudentPopup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
  
const StudentInfo = () => {
  const [allStudentData, setAllStudentData] = useState([]);
  const [filteredStudentData, setFilteredStudentData] = useState([]);
  const [classItems, setClassItems] = useState([]);
  const [sectionItems, setSectionItems] = useState([]);
  const [sessionItems, setSessionItems] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null); // Define selectedSection state
  const [selectedSession, setSelectedSession] = useState(null); // Define selectedSession state
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isStudentSearchOpen, setIsStudentSearchOpen] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [currentParentId, setCurrentParentId] = useState(null);
  const [siblingsData, setSiblingsData] = useState([]);
  const [siblingGroupId, setSiblingGroupId] = useState([]);
  const [isSiblingsModalOpen, setIsSiblingsModalOpen] = useState(false);
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
                `${
                  import.meta.env.VITE_BACKEND_URL
                }/api/get-student-attendance-summary/${student._id}`
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
                attendancePercentage: 0,
                grade: "A",
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

  const clearFilters = () => {
    setSelectedClass(null);
    setSelectedSection(null);
    setSelectedSession(null);
    setSearchText("");
    setFilteredStudentData(allStudentData); // Reset the filtered data to all students
    fetchDropdownData();
  };

  const handleFilter = () => {
    let filteredData = allStudentData;

    if (selectedClass) {
      filteredData = filteredData.filter(
        (student) => student.currentClass._id === selectedClass._id
      );
    }

    if (selectedSection) {
      filteredData = filteredData.filter(
        (student) => student.currentSection._id === selectedSection._id
      );
    }

    if (selectedSession) {
      filteredData = filteredData.filter(
        (student) => student.currentSession._id === selectedSession._id
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

  const handleSearch = (text) => {
    setSearchText(text);
    handleFilter();
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
    setCurrentStudentId(studentData._id);
    setCurrentParentId(studentData.parent);
    setIsStudentSearchOpen(true);
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
    setIsStudentSearchOpen(false);
  };

  const handleViewSiblings = async (studentData) => {
    setSiblingGroupId(studentData.siblingGroupId);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-sibling-group-studentid/${
          studentData._id
        }`
      );
      console.log("this is response", response);
      if (response.status === 200) {
        setSiblingsData(response.data.data);
        setIsSiblingsModalOpen(true);
      } else if (response.status === 404) {
        toast.error("No Siblings Available");
      }
    } catch (error) {
      console.error("Error fetching siblings:", error);
      toast.error(error.response.data.message);
    }
  };

  const handleSiblingRemoved = (studentId) => {
    setSiblingsData((prevData) =>
      prevData.filter((sibling) => sibling._id !== studentId)
    );
    toast.success("Sibling removed successfully.");
  };

  return (
    <div>
      <SearchBar
        classItems={classItems}
        sectionItems={sectionItems}
        sessionItems={sessionItems}
        onFilter={({ type, value }) => {
          if (type === "class") setSelectedClass(value);
          if (type === "section") setSelectedSection(value);
          if (type === "session") setSelectedSession(value);
          handleFilter();
        }}
        onSearch={(text) => {
          setSearchText(text);
          handleFilter();
        }}
        onClearFilters={clearFilters} // Pass clearFilters to SearchBar
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
        siblingGroupId={siblingGroupId}
        onSiblingRemoved={handleSiblingRemoved}
      />
      <ToastContainer />
    </div>
  );
};

const SiblingModal = ({
  isOpen,
  onClose,
  siblings,
  siblingGroupId,
  onSiblingRemoved,
}) => {
  const handleRemoveSibling = async (studentId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/remove-sibling-from-group`,
        {
          siblingGroupId,
          studentId,
        }
      );
      if (response.status === 200) {
        onSiblingRemoved(studentId);
      } else {
        console.error("Failed to remove sibling.");
      }
    } catch (error) {
      console.error("Error removing sibling:", error);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-900 bg-opacity-90 flex justify-center items-center ${
        isOpen ? "" : "hidden"
      }`}
      style={{ zIndex: 1000 }}
    >
      <div className="bg-gradient-to-br from-[#283046] to-gray-800 p-8 rounded-xl w-3/4 max-h-[85%] overflow-y-auto shadow-2xl transform transition-all duration-500 ease-in-out scale-100 hover:scale-105">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-extrabold text-[#65fa9e] tracking-wide">
            Siblings Information
          </h2>
          <button
            onClick={onClose}
            className="text-red-500 text-3xl font-bold focus:outline-none hover:text-red-700 transition duration-300"
          >
            &times;
          </button>
        </div>
        {siblings.length === 0 ? (
          <div className="text-center text-gray-400 text-xl italic">
            No siblings found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siblings.map((sibling) => (
              <div
                key={sibling._id}
                className="p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 hover:scale-105"
              >
                <img
                  src={sibling.studentPhoto || "default-image-url.jpg"}
                  alt={`${sibling.firstName} ${sibling.lastName}`}
                  className="w-full h-48 object-cover rounded-lg mb-4 shadow-md hover:shadow-xl transition-shadow duration-300"
                />
                <h3 className="text-2xl font-semibold text-[#65fa9e] mb-2 text-center">
                  {`${sibling.firstName} ${sibling.lastName}`}
                </h3>
                <p className="text-gray-300 text-base font-medium text-center">
                  Class: {sibling.currentClass.name}
                </p>
                <button
                  onClick={() => handleRemoveSibling(sibling._id)}
                  className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Remove Sibling
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentInfo;
