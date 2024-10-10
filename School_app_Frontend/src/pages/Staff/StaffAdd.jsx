import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../../components/Form/Input";
import Select from "../../components/Form/Select";
import FormSection from "../../components/Form/FormSection";
import FormButton from "../../components/Form/FormButton";

const StaffAdd = () => {
  const { staffId } = useParams();

  const initialFormData = {
    name: "",
    age: "",
    type: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    staffAttendance: [],
    dateJoined: "",
    gender: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const fetchStaffDataById = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-single-staff/${staffId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const staffData = response.data.data;
      console.log(staffData);
      setFormData(staffData);
    } catch (error) {
      console.error("Error fetching staff data:", error);
      toast.error("Error fetching staff data.");
    }
  };

  useEffect(() => {
    if (staffId) {
      fetchStaffDataById();
    } else {
      // Reset form data when navigating to Add Staff
      setFormData(initialFormData);
    }
  }, [staffId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber" && value.length > 10) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const schoolId = import.meta.env.VITE_SchoolId;
    const requiredFields = [
      "name",
      "age",
      "type",
      "email",
      "password",
      "phoneNumber",
      "address",
      "dateJoined",
      "gender",
    ];
    const isEmpty = requiredFields.some((field) => !formData[field]);

    if (isEmpty) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const url = staffId
        ? `${import.meta.env.VITE_BACKEND_URL}/api/update-staff/${staffId}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/create-staff/${schoolId}`;

      const method = staffId ? "put" : "post";

      const response = await axios({
        method: method,
        url: url,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log(response.data);

      const successMessage = staffId
        ? "Staff updated successfully!"
        : "Staff added successfully!";
      toast.success(successMessage);

      // Reset form data after submission
      setFormData(initialFormData);
    } catch (error) {
      const errorMessage = staffId
        ? "Error updating staff: "
        : "Error adding staff: ";
      toast.error(errorMessage + error.response.data.message);
      console.error(errorMessage, error.response.data);
    }
  };

  return (
    <form
      className="max-w-full mx-auto p-6 bg-[#283046] rounded-lg shadow-lg text-[#E0E0E0]"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6 text-[#7367F0]">
        {staffId ? "Edit Staff" : "Add Staff"}
      </h2>

      {/* Staff Details Section */}
      <FormSection title="Staff Details">
        <Input
          labelName="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Name"
        />
        <Select
          labelName="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={[
            { id: "Male", name: "Male" },
            { id: "Female", name: "Female" },
          ]}
          placeholder="Select"
        />
        <Input
          labelName="Age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Enter Age"
          type="number"
        />

        <Input
          labelName="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Email"
          type="email"
        />
        {!staffId ? (
          <Input
            labelName="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
          />
        ) : null}
        <Input
          labelName="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Enter Phone Number"
          type="tel"
          maxLength="10"
        />
        <Input
          labelName="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter Address"
        />
        <Select
          labelName="Staff Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={[
            { id: "Cleaning", name: "Cleaning" },
            { id: "Security", name: "Security" },
            { id: "Care Taker", name: "Care Taker" },
            { id: "Peon", name: "Peon" },
            { id: "Office Staff", name: "Office Staff" },
            { id: "Librarian", name: "Librarian" },
            { id: "Other", name: "Other" },
          ]}
          placeholder="Select Staff Type"
        />
        {!staffId ? (
          <Input
            labelName="Date Joined"
            name="dateJoined"
            value={formData.dateJoined}
            onChange={handleChange}
            placeholder="Enter Date Joined"
            type="date"
          />
        ) : null}
      </FormSection>

      {/* Submit Button */}
      {staffId ? (
        <FormButton name="Edit Staff" />
      ) : (
        <FormButton name="Add Staff" />
      )}

      <ToastContainer />
    </form>
  );
};

export default StaffAdd;
