import React, { useState, useEffect } from "react";
import { getAPI } from "../../utility/api/apiCall";
import Input from "../../components/Form/Input";
import FormSection from "../../components/Form/FormSection";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormButton from "../../components/Form/FormButton";

const ParentAdd = () => {
  const { studentId, parentId } = useParams();
  console.log(studentId, parentId);

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
    guardianRelation: "",
    guardianPhone: "",
    guardianOccupation: "",
    email: "",
    // guardianPhoto: "",
    guardianAddress: "",
    password: "",
  });

  const fetchParentDataByParentId = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-parent/${parentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const parentData = response.data.data;
      console.log(parentData);
      setFormData({
        ...parentData,
      });
    } catch (error) {
      console.error("Error fetching parent data by parentId:", error);
      toast.error("Error fetching parent data.");
    }
  };

  const fetchParentDataByStudentId = async () => {
    const url = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/get-parent-student/${studentId}`;

    try {
      const response = await axios.get(url);
      const parentData = response.data.data;
      console.log(parentData);
      setFormData({
        fatherName: parentData.fatherName || "",
        fatherPhone: parentData.fatherPhone || "",
        fatherOccupation: parentData.fatherOccupation || "",
        motherName: parentData.motherName || "",
        motherPhone: parentData.motherPhone || "",
        motherOccupation: parentData.motherOccupation || "",
        guardianIs: parentData.guardianIs || "",
        guardianName: parentData.guardianName || "",
        guardianRelation: parentData.guardianRelation || "",
        guardianPhone: parentData.guardianPhone || "",
        guardianOccupation: parentData.guardianOccupation || "",
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
      console.log("parent");
    } else if (studentId) {
      console.log("student");
      fetchParentDataByStudentId();
    }
  }, [parentId, studentId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = parentId
        ? `${import.meta.env.VITE_BACKEND_URL}/api/update-parent/${parentId}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/create-parent/${studentId}`;

      const method = parentId ? "put" : "post";

      const response = await axios({
        method: method,
        url: url,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const successMessage = parentId
        ? "Parent updated successfully!"
        : "Parent added successfully!";
      toast.success(successMessage);

      // if (successMessage === "Parent updated successfully!") {
      //   window.location.href = "/school/parent-information";
      // }

      setFormData({
        fatherName: "",
        fatherPhone: "",
        fatherOccupation: "",
        motherName: "",
        motherPhone: "",
        motherOccupation: "",
        guardianIs: "",
        guardianName: "",
        guardianRelation: "",
        guardianPhone: "",
        guardianOccupation: "",
        email: "",
        guardianAddress: "",
        password: "",
      });
    } catch (error) {
      const errorMessage = parentId
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
        {parentId ? "Edit Parent" : "Add Parent"}
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
        <Input
          labelName="Guardian's Relation"
          name="guardianRelation"
          value={formData.guardianRelation}
          onChange={handleChange}
          placeholder="Enter Guardian's Relation"
        />
        <Input
          labelName="Guardian's Phone"
          name="guardianPhone"
          value={formData.guardianPhone}
          onChange={handleChange}
          placeholder="Enter Guardian's Phone"
        />
        <Input
          labelName="Guardian's Occupation"
          name="guardianOccupation"
          value={formData.guardianOccupation}
          onChange={handleChange}
          placeholder="Enter Guardian's Occupation"
        />
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
        <Input
          labelName="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter Password"
        />
      </FormSection>

      {/* Submit Button */}
      {parentId ? (
        <FormButton name="Edit Parent" />
      ) : (
        <FormButton name="Add Parent" />
      )}

      <ToastContainer />
    </form>
  );
};

export default ParentAdd;
