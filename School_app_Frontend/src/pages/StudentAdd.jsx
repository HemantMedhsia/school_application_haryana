import React, { useState, useEffect } from "react";
import { getAPI } from "../utility/api/apiCall";
import Input from "../components/Form/Input";
import Select from "../components/Form/Select";
import FormSection from "../components/Form/FormSection";

const StudentAdd = () => {
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    admissionNo: "",
    rollNumber: "",
    studentLoginPassword: "",
    currentClass: "",
    age: "",
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
      console.log(
        "session",
        sessionsResponse,
        "class",
        classesResponse,
        "section",
        sectionsResponse
      );

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

      {/* Personal Details Section */}
      <FormSection title="Personal Details">
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
        <Select
          labelName="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={[
            { id: "General", name: "General" },
            { id: "OBC", name: "OBC" },
            { id: "SC", name: "SC" },
            { id: "ST", name: "ST" },
          ]}
          placeholder="Select"
        />
        <Input
          labelName="Religion"
          name="religion"
          value={formData.religion}
          onChange={handleChange}
          placeholder="Enter Religion"
        />
        <Input
          labelName="Height"
          name={"height"}
          value={formData.height}
          onChange={handleChange}
          placeholder={"Enter Height"}
        />
        <Input
          labelName="Weight"
          name={"weight"}
          value={formData.weight}
          onChange={handleChange}
          placeholder={"Enter Weight"}
        />
        <Input
          labelName="Blood Group"
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          placeholder="Enter Blood Group"
        />
        <Input
          labelName="Age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Enter Age"
        />
      </FormSection>

      <FormSection title="Address & Contact Details">
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
          labelName="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter Address"
        />
      </FormSection>

      {/* Admission Details Section */}
      <FormSection title="Admission Details">
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
          labelName="Admission Date"
          name="admissionDate"
          type="date"
          value={formData.admissionDate}
          onChange={handleChange}
          placeholder="Enter Admission Date"
        />
        <Input
          labelName="House"
          name="house"
          value={formData.house}
          onChange={handleChange}
          placeholder="Enter House"
        />
      </FormSection>

      {/* Academic Details Section */}
      <FormSection title="Academic Details">
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
      </FormSection>

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
