import React, { useState, useEffect } from "react";
import { getAPI } from "../utility/api/apiCall";
import Input from "../components/Form/Input";
import FormSection from "../components/Form/FormSection";

const ParentAdd = () => {
  const [formData, setFormData] = useState({
    fatherName: "",
    fatherPhone: "",
    fatherOccupation: "",
    fatherPhoto: "",
    motherName: "",
    motherPhone: "",
    motherOccupation: "",
    motherPhoto: "",
    guardianIs: "",
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
    guardianOccupation: "",
    email: "",
    guardianPhoto: "",
    guardianAddress: "",
    password: "",
  });

  
  const fetchData = async () => {
    
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    
  };

  return (
    <form
      className="max-w-full mx-auto p-6 bg-[#283046] rounded-lg shadow-lg text-[#E0E0E0]"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6 text-[#7367F0]">Add Parent</h2>

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
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-[#7367F0] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#4C51BF] transition duration-200 ease-in-out shadow-md"
        >
          Add Parent
        </button>
      </div>
    </form>
  );
};

export default ParentAdd;
