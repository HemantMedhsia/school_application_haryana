import React, { useState, useEffect } from "react";
import { getAPI } from "../../utility/api/apiCall";
import Input from "../../components/Form/Input";
import FormSection from "../../components/Form/FormSection";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormButton from "../../components/Form/FormButton";

const ParentAdd = () => {
  const { studentId, parentId, Id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fatherName: "",
    fatherPhone: "",
    fatherOccupation: "",
    // fatherPhoto: "",
    motherName: "",
    motherPhone: "",
    motherOccupation: "",
    // motherPhoto: "",
    guardianIs: "",
    guardianName: "",
    // guardianRelation: "",
    // guardianPhone: "",
    guardianOccupation: "",
    email: "",
    // guardianPhoto: "",
    guardianAddress: "",
    password: "",
  });
  const [existingParentId, setExistingParentId] = useState(null);

  const fetchParentDataByParentId = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-parent/${parentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
          },
        }
      );
      const parentData = response.data.data;
      setFormData({
        ...parentData,
      });
    } catch (error) {
      console.error("Error fetching parent data by parentId:", error);
      toast.error(
        "Error fetching parent data: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const fetchParentDataByStudentId = async () => {
    const url = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/get-parent-student/${studentId}`;

    try {
      const response = await axios.get(url);
      const parentData = response.data.data;

      if (parentData._id) {
        setExistingParentId(parentData._id);
      }

      setFormData({
        fatherName: parentData.fatherName || "",
        fatherPhone: parentData.fatherPhone || "",
        fatherOccupation: parentData.fatherOccupation || "",
        motherName: parentData.motherName || "",
        motherPhone: parentData.motherPhone || "",
        motherOccupation: parentData.motherOccupation || "",
        guardianIs: parentData.guardianIs || "",
        guardianName: parentData.guardianName || "",
        guardianPhone: parentData.guardianPhone || "",
        // guardianOccupation: parentData.guardianOccupation || "",
        guardianAddress: parentData.guardianAddress || "",
        email: parentData.email || "",
        password: parentData.password || "",
      });
    } catch (error) {
      console.error("Error fetching parent data by studentId:", error);
      toast.error("Error fetching parent data.");
    }
  };

  useEffect(() => {
    if (parentId) {
      fetchParentDataByParentId();
    } else if (studentId) {
      fetchParentDataByStudentId();
    }
  }, [parentId, studentId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.fatherPhone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    if (!phoneRegex.test(formData.motherPhone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      let url, method;

      if (existingParentId || parentId) {
        // If parentId exists (edit mode) or we found an existing parent by studentId, update the parent
        url = `${import.meta.env.VITE_BACKEND_URL}/api/update-parent/${
          parentId || existingParentId
        }`;
        method = "put";
      } else {
        // If no parentId exists, create a new parent
        url = `${import.meta.env.VITE_BACKEND_URL}/api/create-parent/${Id}`;
        method = "post";
      }

      const response = await axios({
        method: method,
        url: url,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const successMessage =
        parentId || existingParentId
          ? "Parent updated successfully!"
          : "Parent added successfully!";

      toast.success(successMessage);

      setTimeout(() => {
        if (successMessage === "Parent added successfully!") {
          navigate("/school/student-admission");
        } else if (successMessage === "Parent updated successfully!") {
          navigate("/school/parent-information");
        }
      }, 1000);

      setFormData({
        fatherName: "",
        fatherPhone: "",
        fatherOccupation: "",
        motherName: "",
        motherPhone: "",
        motherOccupation: "",
        guardianIs: "",
        guardianName: "",
        // guardianPhone: "",
        // guardianOccupation: "",
        email: "",
        guardianAddress: "",
        password: "",
      });
    } catch (error) {
      const errorMessage =
        parentId || existingParentId
          ? "Error updating parent: "
          : "Error adding parent: ";
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
        {parentId || existingParentId ? "Edit Parent" : "Add Parent"}
      </h2>

      {/* Personal Details Section */}
      <FormSection title="Father's Details">
        <Input
          labelName="Father's Name"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
          placeholder="Enter Father's Name"
        />
        <Input
          labelName="Father's Phone"
          name="fatherPhone"
          value={formData.fatherPhone}
          onChange={handleChange}
          placeholder="Enter Father's Phone"
        />
        <Input
          labelName="Father's Occupation"
          name="fatherOccupation"
          value={formData.fatherOccupation}
          onChange={handleChange}
          placeholder="Enter Father's Occupation"
        />
      </FormSection>

      <FormSection title="Mother's Details">
        <Input
          labelName="Mother's Name"
          name="motherName"
          value={formData.motherName}
          onChange={handleChange}
          placeholder="Enter Mother's Name"
        />
        <Input
          labelName="Mother's Phone"
          name="motherPhone"
          value={formData.motherPhone}
          onChange={handleChange}
          placeholder="Enter Mother's Phone"
        />
        <Input
          labelName="Mother's Occupation"
          name="motherOccupation"
          value={formData.motherOccupation}
          onChange={handleChange}
          placeholder="Enter Mother's Occupation"
        />
      </FormSection>

      <FormSection title="Guardian's Details">
        <Input
          labelName="Guardian"
          name="guardianIs"
          value={formData.guardianIs}
          onChange={handleChange}
          placeholder="Enter Guardian Relationship"
        />
        <Input
          labelName="Guardian's Name"
          name="guardianName"
          value={formData.guardianName}
          onChange={handleChange}
          placeholder="Enter Guardian's Name"
        />
        {/* <Input
          labelName="Guardian's Relation"
          name="guardianRelation"
          value={formData.guardianRelation}
          onChange={handleChange}
          placeholder="Enter Guardian's Relation"
        /> */}
        {/* <Input
          labelName="Guardian's Phone"
          name="guardianPhone"
          value={formData.guardianPhone}
          onChange={handleChange}
          placeholder="Enter Guardian's Phone"
        /> */}
        {/* <Input
          labelName="Guardian's Occupation"
          name="guardianOccupation"
          value={formData.guardianOccupation}
          onChange={handleChange}
          placeholder="Enter Guardian's Occupation"
        /> */}
        <Input
          labelName="Guardian's Address"
          name="guardianAddress"
          value={formData.guardianAddress}
          onChange={handleChange}
          placeholder="Enter Guardian's Address"
        />
      </FormSection>

      {/* Email and Password Section */}
      <FormSection title="Account Details">
        <Input
          labelName="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Email"
        />
        {Id ? (
          <Input
            labelName="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
          />
        ) : null}
      </FormSection>

      {/* Submit Button */}
      {parentId || existingParentId ? (
        <FormButton name="Edit Parent" />
      ) : (
        <FormButton name="Add Parent" />
      )}

      <ToastContainer />
    </form>
  );
};

export default ParentAdd;
