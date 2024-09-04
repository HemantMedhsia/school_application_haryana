import React, { useState, useEffect } from "react";
import axios from "axios";

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

  useEffect(() => {
    // Fetch data from API
    axios.get("/api/sessions").then((response) => setSessions(response.data));
    axios.get("/api/classes").then((response) => setClasses(response.data));
    axios.get("/api/sections").then((response) => setSections(response.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the form data to the server
    console.log(formData);
  };

  return (
    <form className="max-w-4xl mx-auto" onSubmit={handleSubmit}>
      {/* First Row */}
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <label
            htmlFor="admissionNo"
            className="block text-sm font-medium text-gray-700"
          >
            Admission No
          </label>
          <input
            type="text"
            name="admissionNo"
            id="admissionNo"
            value={formData.admissionNo}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <label
            htmlFor="rollNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Roll Number
          </label>
          <input
            type="text"
            name="rollNumber"
            id="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <label
            htmlFor="studentLoginPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Login Password
          </label>
          <input
            type="password"
            name="studentLoginPassword"
            id="studentLoginPassword"
            value={formData.studentLoginPassword}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      {/* Second Row */}
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700"
          >
            Gender
          </label>
          <select
            name="gender"
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Third Row */}
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700"
          >
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            id="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <label
            htmlFor="religion"
            className="block text-sm font-medium text-gray-700"
          >
            Religion
          </label>
          <input
            type="text"
            name="religion"
            id="religion"
            value={formData.religion}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      {/* Additional Rows */}
      {/* Add more fields in the same structure as above */}

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>
  );
};

export default StudentAdd;
