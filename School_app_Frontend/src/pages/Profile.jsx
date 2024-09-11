import React, { useEffect, useRef, useState } from "react";
import FormButton from "../components/Form/FormButton";
import { useParams } from "react-router-dom";
import axios from "axios";

const studentData = {
  admissionNo: "A12345",
  rollNumber: "R67890",
  firstName: "Kitty",
  lastName: "Allanson",
  gender: "Female",
  dateOfBirth: "2004-05-15",
  category: "General",
  religion: "Christianity",
  caste: "NA",
  age: "20",
  address: "123 Main St, Springfield",
  mobileNumber: "+123456789",
  email: "kitty.allanson@example.com",
  admissionDate: "2021-09-01",
  studentPhoto:
    "https://www.shutterstock.com/image-photo/portrait-attractive-young-asian-woman-260nw-2411114955.jpg",
  bloodGroup: "O+",
  house: "Red House",
  height: 160,
  weight: 55,
  measurementDate: "2024-09-01",
  medicalHistory: "None",
  role: "Student",
  parent: {
    fatherName: "John Allanson",
    fatherPhone: "+123456789",
    fatherOccupation: "Engineer",
    fatherPhoto: "https://via.placeholder.com/100",
    motherName: "Jane Allanson",
    motherPhone: "+123456780",
    motherOccupation: "Teacher",
    motherPhoto: "https://via.placeholder.com/100",
    guardianIs: "Father",
    guardianName: "John Allanson",
    guardianRelation: "Father",
    guardianPhone: "+123456789",
    guardianOccupation: "Engineer",
    guardianPhoto: "https://via.placeholder.com/100",
    guardianAddress: "123 Main St, Springfield",
  },
};

const Profile = () => {
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState(null);
  const personalInfoRef = useRef(null);
  const academicDetailsRef = useRef(null);
  const participationsRef = useRef(null);
  const studentHistoryRef = useRef(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios(
          `${import.meta.env.VITE_BACKEND_URL}/api/get-student/${studentId}`
        );
        setStudentData(response.data.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, [studentId]);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const renderCard = (title, details) => (
    <div className="bg-gray-900 shadow overflow-hidden sm:rounded-lg mb-6 w-full">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-xl font-semibold leading-6 text-[#7367F0]">
          {title}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Details and information about {title.toLowerCase()}.
        </p>
      </div>
      <div>
        <dl>
          {details.map((detail, index) => (
            <div
              key={index}
              className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-grhover:bg-slate-500 rounded-md ${
                index % 2 === 0 ? "bg-[#283046]" : "bg-gray-900"
              }`}
            >
              <dt className="text-md font-medium text-[#65FA9E]">
                {detail.label}
              </dt>
              <dd className="mt-1 text-lg text-gray-100 sm:mt-0 sm:col-span-2">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-gray-900 text-white rounded-lg overflow-hidden">
      {studentData ? (
        <>
          <div className="relative mb-6">
            <img
              src="http://www.localplaner.de/img/timeline.aa03c008.jpg"
              className="w-full h-56 object-cover rounded-lg"
              alt="Cover"
            />
            <div className="absolute bottom-0 left-0 flex items-center p-4 bg-gradient-to-t from-gray-900 to-transparent w-full">
              <img
                src={
                  studentData.studentPhoto ||
                  "https://www.shutterstock.com/image-photo/portrait-attractive-young-asian-woman-260nw-2411114955.jpg"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-[#65FA9E] object-cover"
              />
              <div className="ml-4">
                <h2 className="text-2xl font-semibold">
                  {studentData.firstName} {studentData.lastName}
                </h2>
                <p className="text-gray-400">Role: {studentData.role}</p>
              </div>
              <div className="ml-auto">
                <FormButton name={"Edit"} />
              </div>
            </div>
          </div>

          <div className="flex justify-around items-center rounded-b-md py-4 bg-gray-900">
            <button
              className="text-[#65FA9E] hover:text-[#286C56]"
              onClick={() => scrollToSection(personalInfoRef)}
            >
              Personal Information
            </button>
            <button
              className="text-[#65FA9E] hover:text-[#286C56]"
              onClick={() => scrollToSection(academicDetailsRef)}
            >
              Academic Details
            </button>
            <button
              className="text-[#65FA9E] hover:text-[#286C56]"
              onClick={() => scrollToSection(participationsRef)}
            >
              Participations
            </button>
            <button
              className="text-[#65FA9E] hover:text-[#286C56]"
              onClick={() => scrollToSection(studentHistoryRef)}
            >
              Student History
            </button>
          </div>

          {/* Flexbox layout for exactly two cards in a row */}
          <div className="flex flex-wrap gap-6 my-6">
            <section
              ref={personalInfoRef}
              className="flex-1 min-w-[48%] text-[#7367F0]"
            >
              {renderCard("Personal Information", [
                {
                  label: "Full Name",
                  value: `${studentData.firstName} ${studentData.lastName}`,
                },
                { label: "Gender", value: studentData.gender },
                {
                  label: "Date of Birth",
                  value: new Date(studentData.dateOfBirth).toLocaleDateString(),
                },
                { label: "Category", value: studentData.category },
                { label: "Religion", value: studentData.religion },
                { label: "Caste", value: studentData.caste },
                { label: "Age", value: studentData.age },
                { label: "Address", value: studentData.address },
                { label: "Mobile", value: studentData.mobileNumber },
                { label: "Email", value: studentData.email },
              ])}
            </section>

            <section ref={academicDetailsRef} className="flex-1 min-w-[48%]">
              {renderCard("Academic Details", [
                {
                  label: "Admission Date",
                  value: new Date(
                    studentData.admissionDate
                  ).toLocaleDateString(),
                },
                { label: "Blood Group", value: studentData.bloodGroup },
                { label: "House", value: studentData.house },
                { label: "Height", value: `${studentData.height} cm` },
                { label: "Weight", value: `${studentData.weight} kg` },
                {
                  label: "Measurement Date",
                  value: new Date(
                    studentData.measurementDate
                  ).toLocaleDateString(),
                },
                { label: "Medical History", value: studentData.medicalHistory },
              ])}
            </section>
          </div>

          <div className="flex flex-wrap gap-6 my-6">
            <section ref={participationsRef} className="flex-1 min-w-[48%]">
              {renderCard("Participations", [
                {
                  label: "Participation Details",
                  value: "No participation data available yet.",
                },
              ])}
            </section>

            <section ref={studentHistoryRef} className="flex-1 min-w-[48%]">
              {renderCard("Student History", [
                {
                  label: "History Details",
                  value: "No student history data available yet.",
                },
              ])}
            </section>
          </div>
        </>
      ) : (
        <span class="loader"></span>
      )}
    </div>
  );
};

export default Profile;
