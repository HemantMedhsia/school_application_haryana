import React, { useEffect, useState } from "react";
import Datatable from "../../common/Datatables/Datatable";
import { getAPI, deleteAPI } from "../../utility/api/apiCall";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/ConfirmationModal/ConfirmationModal";
import { toast, ToastContainer } from "react-toastify";

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Position", accessor: "type" },
  { header: "Email", accessor: "email" },
  { header: "Contact", accessor: "phoneNumber" },
  { header: "Date Of Join", accessor: "dateJoined" },
  { header: "Address", accessor: "address" },
];

const StaffInfo = () => {
  const navigate = useNavigate();
  const [allStaffData, setAllStaffData] = useState([]);
  const [filteredStaffData, setFilteredStaffData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await getAPI("getAllStaff", {}, setAllStaffData);
      setFilteredStaffData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter staff data based on search input
  useEffect(() => {
    const filteredData = allStaffData.filter((staff) =>
      ["name", "type", "department"].some((key) =>
        staff[key]?.toLowerCase().includes(searchText.toLowerCase())
      )
    );
    setFilteredStaffData(filteredData);
  }, [searchText, allStaffData]);

  const handleEdit = (staffData) => {
    navigate(`/school/staff-update/${staffData._id}`);
  };

  const handleDelete = async () => {
    if (!staffToDelete) return;

    try {
      await deleteAPI(`delete-staff/${staffToDelete._id}`);
      setAllStaffData((prevData) =>
        prevData.filter((data) => data._id !== staffToDelete._id)
      );
      toast.success("Staff member deleted successfully.");
      closeModal();
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete staff member.");
    }
  };

  const openModal = (staffData) => {
    setStaffToDelete(staffData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setStaffToDelete(null);
    setIsModalOpen(false);
  };

  const formDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  const formattedData = filteredStaffData.map((staff) => ({
    ...staff,
    dateJoined: formDate(staff.dateJoined),
  }));

  return (
    <div>
      <ToastContainer />
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by Name, Position, or Department"
          className="w-full px-4 py-2 text-white rounded-md  bg-gray-900 border-[#283046] border-2 focus:outline-none focus:border-[#65fa9e]"
        />
      </div>
      {loading ? (
        <div className="loader-wrapper">
          <span className="loader"></span>
        </div>
      ) : formattedData.length > 0 ? (
        <Datatable
          columns={columns}
          data={formattedData}
          actions={{
            onEdit: handleEdit,
            onDelete: openModal,
          }}
        />
      ) : (
        <div className="text-center text-xl mt-4 text-red-600">
          <h3>Oops! No Staff Records Found.</h3>
        </div>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Delete Confirmation"
        message="Are you sure you want to delete this staff member?"
      />
    </div>
  );
};

export default StaffInfo;
