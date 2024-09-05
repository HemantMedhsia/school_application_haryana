import React, { useState, useEffect } from "react";
import { getAPI } from "../../utility/api/apiCall";

const Input = ({ labelName, type = "text", ...props }) => {
  const borderStyle =
    type === "file"
      ? "border-2 border-dashed border-gray-300"
      : "border-[#D5E8EF]";
  return (
    <span className="mx-2 mb-4 flex flex-col">
      <label className="text-sm font-medium leading-none">{labelName}</label>
      <input
        type={type}
        className={`bg-blue-50 mt-3 text-sm w-[220px] h-9 rounded-[5px] flex items-center p-2.5 gap-3.5 text-[#000000] border-2 border-gray-300 ${
          type === "file" ? "file:border-0" : "border-[#D5E8EF]"
        }`}
        {...props}
      />
    </span>
  );
};

const Select = ({ labelName, name, value, onChange, options }) => {
  return (
    <span className="mx-2 mb-4 flex flex-col">
      <label className="text-sm font-medium leading-none">{labelName}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="bg-blue-50 text-xs w-[220px] mt-3 h-9 rounded-[5px] p-2.5 border border-[#D5E8EF]"
      >
        <option value="" disabled>
          Select {labelName}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
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
          //   axios.get("/api/sessions"),
          //   axios.get("/api/classes"),
          //   axios.get("/api/sections"),
          getAPI("getAllSessions", {}, setSessions),
          getAPI("getAllClasses", {}, setClasses),
          getAPI("getAllSections", {}, setSections),
        ]);
      console.log("Sessions:", sessionsResponse.data);
      console.log("Classes:", classesResponse.data);
      console.log("Sections:", sectionsResponse.data);
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
      className="max-w-full mx-auto p-6 bg-[#283046] rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Student</h2>

      {/* Admission No, Roll Number, and Login Password */}
      <div className="flex gap-8 flex-wrap mb-4">
        <Input
          labelName="Admission No"
          name="admissionNo"
          value={formData.admissionNo}
          onChange={handleChange}
        />
        <Input
          labelName="Roll Number"
          name="rollNumber"
          value={formData.rollNumber}
          onChange={handleChange}
        />
        <Input
          labelName="Login Password"
          type="password"
          name="studentLoginPassword"
          value={formData.studentLoginPassword}
          onChange={handleChange}
        />
        <Input
          labelName="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </div>

      {/* First Name, Last Name, and Gender */}
      <div className="flex gap-8 flex-wrap mb-4">
        <Input
          labelName="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
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
        />
        <Input
          labelName={"Date of Birth"}
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
        <Input
          labelName="Religion"
          name="religion"
          value={formData.religion}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-8 flex-wrap mb-4">
        <Select
          labelName="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={[
            { id: "General", name: "General" },
            { id: "Obc", name: "Obc" },
            { id: "Sc", name: "St" },
            { id: "St", name: "St" },
          ]}
        />
        <Input
          labelName="Mobile Number"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
        />
        <Input
          labelName="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          labelName="Blood Group"
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-8 flex-wrap mb-4">
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
        />
        <Input
          labelName="Mobile Number"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
        />
        <Input
          labelName="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          labelName="Blood Group"
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
        />
      </div>

      {/* House , Height ,Weight */}
      <div className="flex flex-wrap gap-8 mb-4">
        <Input
          labelName="House"
          name="house"
          value={formData.house}
          onChange={handleChange}
        />
        <Input
          labelName="Height"
          name="height"
          value={formData.height}
          onChange={handleChange}
        />
        <Input
          labelName="Weight"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
        />
        <Input
          labelName="Medical History"
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleChange}
        />
      </div>

      {/* Dropdowns for Session, Class, and Section */}
      <div className="flex gap-8 flex-wrap mb-4">
        <Select
          labelName="Current Session"
          name="currentSession"
          value={formData.currentSession}
          onChange={handleChange}
          options={sessions.map((session) => ({
            id: session._id, // ensure you're using the correct field for ID
            name: session.sessionYear, // or session.name, depending on the API response
          }))}
        />
        <Select
          labelName="Current Class"
          name="currentClass"
          value={formData.currentClass}
          onChange={handleChange}
          options={classes.map((classItem) => ({
            id: classItem._id, // ensure you're using the correct field for ID
            name: classItem.name, // or classItem.name, depending on the API response
          }))}
        />
        <Select
          labelName="Current Section"
          name="currentSection"
          value={formData.currentSection}
          onChange={handleChange}
          options={sections.map((sectionItem) => ({
            id: sectionItem._id, // ensure you're using the correct field for ID
            name: sectionItem.name, // or sectionItem.name, depending on the API response
          }))}
        />

        <Input
          labelName={"Admission Date"}
          name="admissionDate"
          type="date"
          value={formData.admissionDate}
          onChange={handleChange}
        />
      </div>

      {/* <div className="flex gap-4 flex-wrap mb-4">
        <Input
          labelName="Student Photo"
          name="studentPhoto"
          type="file"
          value={formData.studentPhoto}
          onChange={handleChange}
        />
      </div> */}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out"
        >
          Add Student
        </button>
      </div>
    </form>
  );
};

export default StudentAdd;
