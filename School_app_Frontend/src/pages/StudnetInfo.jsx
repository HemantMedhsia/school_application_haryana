import React, { useEffect, useState } from "react";
import Datatable from "../common/Datatables/Datatable";
import SearchBar from "../common/SearchBar/SearchBar";
import { deleteAPI, getAPI } from "../utility/api/apiCall";

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#65FA9E] bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-[#a49fdd] p-6 rounded-md shadow-lg">
        <h2 className="text-lg text-grey-400 mb-4">Are you sure you want to delete this student?</h2>
        <div className="flex justify-end">
          <button
            className="bg-red-500 hover:bg-red-300 text-white px-4 py-2 rounded mr-2"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentInfo = () => {
  const [allStudentData, setAllStudentData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

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
      accessor: "currentClass.name",
    },
    {
      header: "Section",
      accessor: "section",
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
    console.log("Viewing parent data:", studentData);
  };

  const handleEdit = (studentData) => {
    console.log("Editing parent data:", studentData);
  };

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
          onDelete: openModal, // Open modal instead of directly deleting
        }}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default StudentInfo;
