import React, { useEffect, useState } from "react";
// import StaffSearchBar from "../../common/SearchBar/StaffSearchBar";
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

  useEffect(() => {
    const filteredData = allStaffData.filter(
      (staff) =>
        staff.name.toLowerCase().includes(searchText.toLowerCase()) ||
        staff.position.toLowerCase().includes(searchText.toLowerCase()) ||
        staff.department.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredStaffData(filteredData);
  }, [searchText, allStaffData]);

  //   const handleView = (staffData) => {
  //     navigate(`/school/staff-profile/${staffData._id}`);
  //   };

  const handleEdit = (staffData) => {
    navigate(`/school/staff-update/${staffData._id}`);
  };

  const handleDelete = async () => {
    if (!staffToDelete) return;

    try {
      const res = await deleteAPI(`delete-staff/${staffToDelete._id}`);
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
      {/* <StaffSearchBar searchText={searchText} setSearchText={setSearchText} /> */}
      {loading ? (
        <div className="loader-wrapper">
          <span className="loader"></span>
        </div>
      ) : formattedData.length > 0 ? (
        <Datatable
          columns={columns}
          data={formattedData}
          actions={{
            // onView: handleView,
            onEdit: handleEdit,
            onDelete: openModal,
          }}
        />
      ) : (
        <div className="text-center text-xl mt-4 text-red-600">
          <h3>No staff members found.</h3>
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
