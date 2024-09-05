import React, { useState, useEffect } from "react";
import { getAPI } from "../../utility/api/apiCall";

const Input = ({ labelName, type = "text", placeholder = "", ...props }) => {
  return (
    <span className="flex flex-col w-full md:w-1/3 px-2 mb-4">
      <label className="text-sm font-medium leading-none text-gray-300">
        {labelName}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="bg-[#283046] mt-2 text-sm w-full h-9 rounded-[5px] p-2.5 text-[#FFFFFF] border-2 border-gray-600 focus:border-[#6B46C1] outline-none"
        {...props}
      />
    </span>
  );
};

const Select = ({ labelName, name, value, onChange, options, placeholder = "Select" }) => {
  return (
    <span className="flex flex-col w-full md:w-1/3 px-2 mb-4">
      <label className="text-sm font-medium leading-none text-gray-400">{labelName}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="bg-[#283046] text-sm text-[#FFFFFF] mt-2 w-full h-9 rounded-[5px] border-2 border-[#39424E] focus:border-[#6B46C1] outline-none"
      >
        <option value="" disabled className="text-gray-500">
          {placeholder} {labelName}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id} className="text-[#FFFFFF]">
            {option.name}
          </option>
        ))}
      </select>
    </span>
  );
};

const StudentAdd = () => {
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    admissionNo: "",
    rollNumber: "",
    studentLoginPassword: "",
    currentClass: "",
    currentSection: "",
    currentSession: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    category: "",
    religion: "",
    caste: "",
    mobileNumber: "",
    email: "",
    admissionDate: "",
    studentPhoto: "",
    bloodGroup: "",
    house: "",
    height: "",
    weight: "",
    measurementDate: "",
    medicalHistory: "",
  });

  // Fetch data from API
  const fetchData = async () => {
    try {
      const [sessionsResponse, classesResponse, sectionsResponse] =
        await Promise.all([
          getAPI("getAllSessions", {}, setSessions),
          getAPI("getAllClasses", {}, setClasses),
          getAPI("getAllSections", {}, setSections),
        ]);

      setSessions(
        Array.isArray(sessionsResponse.data) ? sessionsResponse.data : []
      );
      setClasses(
        Array.isArray(classesResponse.data) ? classesResponse.data : []
      );
      setSections(
        Array.isArray(sectionsResponse.data) ? sectionsResponse.data : []
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
      <h2 className="text-2xl font-bold mb-6 text-[#7367F0]">Add Student</h2>

      {/* Form Fields */}
      <div className="flex flex-wrap -mx-2">
        <Input
          labelName="Admission No"
          name="admissionNo"
          value={formData.admissionNo}
          onChange={handleChange}
          placeholder="Enter Admission No"
        />
        <Input
          labelName="Roll Number"
          name="rollNumber"
          value={formData.rollNumber}
          onChange={handleChange}
          placeholder="Enter Roll Number"
        />
        <Input
          labelName="Login Password"
          type="password"
          name="studentLoginPassword"
          value={formData.studentLoginPassword}
          onChange={handleChange}
          placeholder="Enter Login Password"
        />
        <Input
          labelName="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Enter First Name"
        />
        <Input
          labelName="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Enter Last Name"
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
          labelName="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          placeholder="Enter Date of Birth"
        />
        <Input
          labelName="Religion"
          name="religion"
          value={formData.religion}
          onChange={handleChange}
          placeholder="Enter Religion"
        />
        <Select
          labelName="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={[
            { id: "General", name: "General" },
            { id: "Obc", name: "Obc" },
            { id: "Sc", name: "Sc" },
            { id: "St", name: "St" },
          ]}
          placeholder="Select"
        />
        <Input
          labelName="Mobile Number"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          placeholder="Enter Mobile Number"
        />
        <Input
          labelName="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Email"
        />
        <Input
          labelName="Blood Group"
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          placeholder="Enter Blood Group"
        />
        <Input
          labelName="House"
          name="house"
          value={formData.house}
          onChange={handleChange}
          placeholder="Enter House"
        />
        <Input
          labelName="Height"
          name="height"
          value={formData.height}
          onChange={handleChange}
          placeholder="Enter Height"
        />
        <Input
          labelName="Weight"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          placeholder="Enter Weight"
        />
        <Input
          labelName="Medical History"
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleChange}
          placeholder="Enter Medical History"
        />
        <Select
          labelName="Current Session"
          name="currentSession"
          value={formData.currentSession}
          onChange={handleChange}
          options={sessions.map((session) => ({
            id: session._id,
            name: session.sessionYear,
          }))}
          placeholder="Select"
        />
        <Select
          labelName="Current Class"
          name="currentClass"
          value={formData.currentClass}
          onChange={handleChange}
          options={classes.map((classItem) => ({
            id: classItem._id,
            name: classItem.name,
          }))}
          placeholder="Select"
        />
        <Select
          labelName="Current Section"
          name="currentSection"
          value={formData.currentSection}
          onChange={handleChange}
          options={sections.map((sectionItem) => ({
            id: sectionItem._id,
            name: sectionItem.name,
          }))}
          placeholder="Select"
        />
        <Input
          labelName="Admission Date"
          name="admissionDate"
          type="date"
          value={formData.admissionDate}
          onChange={handleChange}
          placeholder="Enter Admission Date"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-[#7367F0] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#4C51BF] transition duration-200 ease-in-out shadow-md"
        >
          Add Student
        </button>
      </div>
    </form>
  );
};

export default StudentAdd;
