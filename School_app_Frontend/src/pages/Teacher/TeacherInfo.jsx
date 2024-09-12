import React, { useEffect, useState } from "react";
import TeacherSearchBar from "../../common/SearchBar/TeacherSearchBar";
import Datatable from "../../common/Datatables/Datatable";
import { getAPI, deleteAPI } from "../../utility/api/apiCall";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/ConfirmationModal/ConfirmationModal";
import { toast } from "react-toastify";

const columns = [
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Age",
    accessor: "age",
  },
  {
    header: "Gender",
    accessor: "gender",
  },
  {
    header: "Email",
    accessor: "email",
  },
  {
    header: "Subject",
    accessor: "subject",
  },
  {
    header: "Contact",
    accessor: "contact",
  },
  {
    header: "Address",
    accessor: "address",
  },
];

const TeacherInfo = () => {
  const navigate = useNavigate();
  const [allTeacherData, setAllTeacherData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const fetchData = async () => {
    try {
      const response = await getAPI("getAllTeachers", {}, setAllTeacherData);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleView = (teacherData) => {
    navigate(`/school/teacher-profile/${teacherData._id}`);
  };

  const handleEdit = (teacherData) => {
    navigate(`/school/teacher-update/${teacherData._id}`);
  };

  const handleDelete = async () => {
    if (!teacherToDelete) return;

    try {
      console.log("Deleting teacher data:", teacherToDelete._id);
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
      <TeacherSearchBar />
      <Datatable
        columns={columns}
        data={allTeacherData}
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
        message="Are you sure you want to delete this teacher?"
      />
    </div>
  );
};

export default TeacherInfo;
