import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../../components/Form/Input";
import FormSection from "../../components/Form/FormSection";
import FormButton from "../../components/Form/FormButton";
import Select from "../../components/Form/Select";

const TeacherAdd = () => {
  const { teacherId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    subject: "",
    email: "",
    password: "",
    contact: "",
    profile: "",
    profileImage: "",
    qualification: "",
    experience: "",
    adharNo: "",
    panNo: "",
    address: "",
  });

  const fetchTeacherDataById = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/get-single-teacher/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const teacherData = response.data.data;
      console.log(teacherData);
      setFormData(teacherData);
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      toast.error("Error fetching teacher data.");
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchTeacherDataById();
    } else {
      // Clear the form when teacherId is not provided (i.e., on /school/teacher-add)
      setFormData({
        name: "",
        age: "",
        gender: "",
        subject: "",
        email: "",
        password: "",
        contact: "",
        profile: "",
        profileImage: "",
        qualification: "",
        experience: "",
        adharNo: "",
        panNo: "",
        address: "",
      });
    }
  }, [teacherId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const schoolId = import.meta.env.VITE_SchoolId;
    const schoolId = localStorage.getItem("schoolId");
    if (!schoolId) {
      toast.error("School ID not found. Please login again.");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.contact)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    const phoneRegex1 = /^\d{12}$/;
    if (!phoneRegex1.test(formData.adharNo)) {
      toast.error("Adhar number must be exactly 12 digits.");
      return;
    }

    try {
      const url = teacherId
        ? `${import.meta.env.VITE_BACKEND_URL}/api/update-teacher/${teacherId}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/create-teacher/${schoolId}`;

      const method = teacherId ? "put" : "post";

      const response = await axios({
        method: method,
        url: url,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
        },
      });
      console.log(response.data);

      const successMessage = teacherId
        ? "Teacher updated successfully!"
        : "Teacher added successfully!";
      toast.success(successMessage);

      //   if (successMessage === "Teacher updated successfully!") {
      //     window.location.href = "/school/all-teachers";
      //   }

      setFormData({
        name: "",
        age: "",
        gender: "",
        subject: "",
        email: "",
        password: "",
        contact: "",
        profile: "",
        profileImage: "",
        qualification: "",
        experience: "",
        adharNo: "",
        panNo: "",
        address: "",
      });
    } catch (error) {
      const errorMessage = teacherId
        ? "Error updating teacher: "
        : "Error adding teacher: ";
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
        {teacherId ? "Edit Teacher" : "Add Teacher"}
      </h2>

      {/* Teacher Details Section */}
      <FormSection title="Personal Details">
        <Input
          labelName="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Name"
        />
        <Input
          labelName="Age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Enter Age"
          type="number"
        />
        <Select
          labelName="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={[
            { id: "Male", name: "Male" },
            { id: "Female", name: "Female" },
            { id: "Other", name: "Other" },
          ]}
          placeholder="Select"
        />
        <Input
          labelName="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Enter Subject"
        />

        <Input
          labelName="Profile"
          name="profile"
          value={formData.profile}
          onChange={handleChange}
          placeholder="Enter Profile Description"
        />
        <Input
          labelName="Profile Image URL"
          name="profileImage"
          value={formData.profileImage}
          onChange={handleChange}
          placeholder="Enter Profile Image URL"
        />
      </FormSection>

      {/* Qualification and Experience Section */}
      <FormSection title="Qualifications and Experience">
        <Input
          labelName="Qualification"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
          placeholder="Enter Qualification"
        />
        <Input
          labelName="Experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Enter Experience"
        />
        <Input
          labelName="Adhar Number"
          name="adharNo"
          value={formData.adharNo}
          onChange={handleChange}
          placeholder="Enter Adhar Number"
          type="number"
        />
        <Input
          labelName="PAN Number"
          name="panNo"
          value={formData.panNo}
          onChange={handleChange}
          placeholder="Enter PAN Number"
        />
        <Input
          labelName="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter Address"
        />
      </FormSection>

      {/* Password Section */}
      <FormSection title="Account Details">
        {!teacherId ? (
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
          labelName="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Email"
          type="email"
        />
        <Input
          labelName="Contact Number"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          placeholder="Enter Contact Number"
          type="tel"
        />
      </FormSection>

      {/* Submit Button */}
      {teacherId ? (
        <FormButton name="Edit Teacher" />
      ) : (
        <FormButton name="Add Teacher" />
      )}

      <ToastContainer />
    </form>
  );
};

export default TeacherAdd;
