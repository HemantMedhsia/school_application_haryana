import React, { useEffect, useState } from "react";
import Datatable from "../../common/Datatables/Datatable";
import SearchBar from "../../common/SearchBar/SearchBar";
import { deleteAPI, getAPI } from "../../utility/api/apiCall";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/ConfirmationModal/ConfirmationModal";
import DetailsSelectionModal from "../../common/ConfirmationModal/DetailsSelectionModal";

const StudentInfo = () => {
  const [allStudentData, setAllStudentData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

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
      header: "Age",
      accessor: "age",
    },
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
      header: "Attendance",
      accessor: "attendance",
      render: (value, item) => {
        const attendanceValue = parseFloat(value);
        return (
          <div className="flex items-center">
            <span className="mr-2">{value}</span>
            <div className="relative w-full">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-600">
                <div
                  style={{
                    width: `${attendanceValue}%`,
                    backgroundColor: item.color,
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
      header: "Grade",
      accessor: "grade",
    },
  ];

  const handleEdit = (studentData) => {
    setSelectedStudent(studentData);
    setIsDetailsModalOpen(true);
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

  const fetchData = async () => {
    try {
      const response = await getAPI("getAllStudents", {}, setAllStudentData);
      if (response && Array.isArray(response)) {
        setAllStudentData(response);
      } else if (response && typeof response === "object") {
        setAllStudentData(response.data || []);
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleView = (studentData) => {
    navigate(`/school/profile/${studentData._id}`);
  };

  // const handleEdit = (studentData) => {
  //   navigate(`/school/student-admission/${studentData._id}`);
  // };

  const handleDelete = async () => {
    if (!studentToDelete) return;

    try {
      console.log("Deleting student data:", studentToDelete._id);
      const res = await deleteAPI(`delete-student/${studentToDelete._id}`);
      setAllStudentData((prevData) =>
        prevData.filter((data) => data._id !== studentToDelete._id)
      );
      console.log(res);
      closeModal(); // Close modal after deletion
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const openModal = (studentData) => {
    setStudentToDelete(studentData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setStudentToDelete(null);
    setIsModalOpen(false);
  };

  return (
    <div className="">
      <SearchBar />
      <Datatable
        data={allStudentData}
        columns={columns}
        actions={{
          onView: handleView,
          onEdit: handleEdit,
          onDelete: openModal,
        }}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Delete Confirmation"
        message="Are you sure you want to delete this student?"
      />
      <DetailsSelectionModal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        onSelect={handleDetailsSelect}
      />
    </div>
  );
};

export default StudentInfo;
