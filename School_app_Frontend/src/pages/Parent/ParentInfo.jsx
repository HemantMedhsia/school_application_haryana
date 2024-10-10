import React, { useEffect, useState } from "react";
import Datatable from "../../common/Datatables/Datatable";
import SearchBar from "../../common/SearchBar/SearchBar";
import { deleteAPI, getAPI } from "../../utility/api/apiCall";
import ConfirmationModal from "../../common/ConfirmationModal/ConfirmationModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ParentInfo = () => {
  const [allParentData, setAllParentData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parentToDelete, setparentToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const columns = [
    {
      header: "Father's Name",
      accessor: "fatherName",
    },
    {
      header: "Father's Phone",
      accessor: "fatherPhone",
    },
    {
      header: "Mother's Name",
      accessor: "motherName",
    },

    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Guardian's Address",
      accessor: "guardianAddress",
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [AllParentResponse] = await Promise.all([
        getAPI("getAllParents", {}, setAllParentData),
      ]);
      console.log(AllParentResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleView = (parentData) => {
    navigate(`/school/parent-profile/${parentData._id}`);
  };

  const handleEdit = (parentData) => {
    navigate(`/school/parent-update/${parentData._id}`);
  };

  const handleDelete = async () => {
    if (!parentToDelete) return;

    try {
      console.log("Deleting parent data:", parentToDelete._id);
      const res = await deleteAPI(`delete-parent/${parentToDelete._id}`);
      setAllParentData((prevData) =>
        prevData.filter((data) => data._id !== parentToDelete._id)
      );
      toast.success("Parent deleted successfully.");
      closeModal();
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete parent.");
    }
  };

  const openModal = (parentData) => {
    setparentToDelete(parentData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setparentToDelete(null);
    setIsModalOpen(false);
  };
  return (
    <div className="">
      <SearchBar />
      {loading ? (
        <div className="loader-wrapper">
          <span className="loader"></span>
        </div>
      ) : allParentData.length === 0 ? (
        <div className="no-data-message text-xl flex justify-center text-red-500">
          Oops! No Parents Records Found.
        </div>
      ) : (
        <Datatable
          data={allParentData}
          columns={columns}
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
        message="Are you sure you want to delete this parent?"
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ParentInfo;
