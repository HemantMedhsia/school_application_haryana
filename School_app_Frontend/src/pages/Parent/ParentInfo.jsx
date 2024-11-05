import React, { useEffect, useState } from "react";
import Datatable from "../../common/Datatables/Datatable";
import SearchBar from "../../common/SearchBar/SearchBar";
import { deleteAPI, getAPI } from "../../utility/api/apiCall";
import ConfirmationModal from "../../common/ConfirmationModal/ConfirmationModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "../../components/ErrorBoundry/ErrorBoundary";

const ParentInfo = () => {
  const [allParentData, setAllParentData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredParentData, setFilteredParentData] = useState([]);
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
      setFilteredParentData(AllParentResponse.data);
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

  useEffect(() => {
    const filteredData = allParentData.filter((parent) =>
      ["fatherName", "email", "fatherPhone"].some((key) => {
        const value = parent[key];
        return (
          value &&
          value.toString().toLowerCase().includes(searchText.toLowerCase())
        );
      })
    );
    setFilteredParentData(filteredData);
  }, [searchText, allParentData]);

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
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by Father name, Email, or Mobile Number"
          className="w-full px-4 py-2 text-white rounded-md  bg-gray-900 border-[#283046] border-2 focus:outline-none focus:border-[#65fa9e]"
        />
      </div>
      {loading ? (
        <div className="loader-wrapper">
          <span className="loader"></span>
        </div>
      ) : allParentData.length === 0 ? (
        <div className="no-data-message text-xl flex justify-center text-red-500">
          Oops! No Parents Records Found.
        </div>
      ) : (
        <ErrorBoundary>
          <Datatable
            data={filteredParentData}
            // data={null}
            columns={columns}
            actions={{
              onView: handleView,
              onEdit: handleEdit,
              onDelete: openModal,
            }}
          />
        </ErrorBoundary>
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
