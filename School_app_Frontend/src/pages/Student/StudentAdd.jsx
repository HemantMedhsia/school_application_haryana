import React, { useState, useEffect } from "react";
import { getAPI } from "../../utility/api/apiCall";
import Input from "../../components/Form/Input";
import Select from "../../components/Form/Select";
import FormSection from "../../components/Form/FormSection";
import FormButton from "../../components/Form/FormButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const StudentAdd = () => {
  const { studentId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    admissionNo: "",
    rollNumber: "",
    password: "",
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
    // caste: "",
    mobileNumber: "",
    email: "",
    admissionDate: "",
    // studentPhoto: "", it is use when photo is upload
    bloodGroup: "",
    house: "",
    height: "",
    weight: "",
    // measurementDate: "",
    // medicalHistory: "",
  });

  useEffect(() => {
    setFormData({
      admissionNo: "",
      rollNumber: "",
      password: "",
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
      mobileNumber: "",
      email: "",
      admissionDate: "",
      bloodGroup: "",
      house: "",
      height: "",
      weight: "",
    });

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

        if (studentId) {
          const studentResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/get-student/${studentId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
              },
            }
          );

          const studentData = studentResponse.data.data;

          setFormData({
            ...studentData,
            admissionDate: studentData.admissionDate.split("T")[0],
            dateOfBirth: studentData.dateOfBirth.split("T")[0],
            currentSession: studentData.currentSession?._id || "",
            currentClass: studentData.currentClass?._id || "",
            currentSection: studentData.currentSection?._id || "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [studentId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const schoolId = import.meta.env.VITE_SchoolId;

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.mobileNumber)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      const response = studentId
        ? await axios.patch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/update-student/${studentId}`,
            formData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
        : await axios.post(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/create-student/${schoolId}`,
            formData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );

      const action = studentId ? "updated" : "added";
      toast.success(`Student ${action} successfully!`);

      if (!studentId) {
        setFormData({
          admissionNo: "",
          rollNumber: "",
          password: "",
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
          mobileNumber: "",
          email: "",
          admissionDate: "",
          bloodGroup: "",
          house: "",
          height: "",
          weight: "",
        });

        const studentIdToNavigate = response.data.data._id;
        navigate(`/school/parent-add/${studentIdToNavigate}`);
      } else {
        console.log("Student updated successfully.");
      }
    } catch (error) {
      let errorMessage = "An error occurred. Please try again later.";

      if (error.response) {
        if (
          error.response.data.message.includes("E11000 duplicate key error")
        ) {
          if (error.response.data.message.includes("rollNumber")) {
            errorMessage =
              "A student with this roll number already exists. Please use a different roll number.";
          } else {
            errorMessage =
              "Duplicate key error. Please make sure all unique fields are different.";
          }
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else {
        errorMessage = error.message || errorMessage;
      }

      console.error("Error adding/updating student:", errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <form
      className="max-w-full mx-auto p-6 bg-[#283046] rounded-lg shadow-lg text-[#E0E0E0]"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6 text-[#7367F0]">
        {studentId ? "Edit Student" : "Add Student"}
      </h2>

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
          placeholder={"Enter Height in Feet"}
        />
        <Input
          labelName="Weight"
          name={"weight"}
          value={formData.weight}
          onChange={handleChange}
          placeholder={"Enter Weight in Kg"}
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

        {!studentId ? (
          <Input
            labelName="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter  Password"
          />
        ) : null}

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
      {studentId ? (
        <FormButton name="Edit Student" />
      ) : (
        <FormButton name="Add Student" />
      )}

      <ToastContainer />
    </form>
  );
};

export default StudentAdd;
