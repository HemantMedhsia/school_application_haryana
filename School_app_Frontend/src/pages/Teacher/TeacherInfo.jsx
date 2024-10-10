import React, { useEffect, useState } from "react";
import TeacherSearchBar from "../../common/SearchBar/TeacherSearchBar";
import Datatable from "../../common/Datatables/Datatable";
import { getAPI, deleteAPI } from "../../utility/api/apiCall";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/ConfirmationModal/ConfirmationModal";
import { toast, ToastContainer } from "react-toastify";

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Age", accessor: "age" },
  { header: "Gender", accessor: "gender" },
  { header: "Email", accessor: "email" },
  { header: "Subject", accessor: "subject" },
  { header: "Contact", accessor: "contact" },
  { header: "Address", accessor: "address" },
];

const TeacherInfo = () => {
  const navigate = useNavigate();
  const [allTeacherData, setAllTeacherData] = useState([]);
  const [filteredTeacherData, setFilteredTeacherData] = useState([]);
  const [searchText, setSearchText] = useState(""); // For search input
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAPI("getAllTeachers", {}, setAllTeacherData);
      setFilteredTeacherData(response.data); // Initialize filtered data
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter the teacher data based on the search text
    try {
      const filteredData = allTeacherData?.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchText.toLowerCase()) ||
          teacher.subject.toLowerCase().includes(searchText.toLowerCase()) // Add more fields as needed
      );
      setFilteredTeacherData(filteredData);
    } catch (error) {
      toast.error("Something went wrong while filtering data.");
    }
  }, [searchText, allTeacherData]);

  const handleView = (teacherData) => {
    navigate(`/school/teacher-profile/${teacherData._id}`);
  };

  const handleEdit = (teacherData) => {
    navigate(`/school/teacher-update/${teacherData._id}`);
  };

  const handleDelete = async () => {
    if (!teacherToDelete) return;

    try {
      const res = await deleteAPI(`delete-teacher/${teacherToDelete._id}`);
      setAllTeacherData((prevData) =>
        prevData.filter((data) => data._id !== teacherToDelete._id)
      );
      toast.success("Teacher deleted successfully.");
      closeModal();
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete teacher.");
    }
  };

  const openModal = (teacherData) => {
    setTeacherToDelete(teacherData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setTeacherToDelete(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <ToastContainer />
      <TeacherSearchBar searchText={searchText} setSearchText={setSearchText} />
      {loading ? (
        <div className="loader-wrapper">
          <span className="loader"></span>
        </div>
      ) : filteredTeacherData.length === 0 ? (
        <div className="no-data-message text-xl flex justify-center text-red-500">
          Oops! No Teacher Records Found.
        </div>
      ) : (
        <Datatable
          columns={columns}
          data={filteredTeacherData} // Pass filtered data to Datatable
          actions={{
            onView: handleView,
            onEdit: handleEdit,
            onDelete: openModal,
          }}
        />
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Delete Confirmation"
        message="Are you sure you want to delete this teacher?"
      />
    </div>
  );
};

export default TeacherInfo;
