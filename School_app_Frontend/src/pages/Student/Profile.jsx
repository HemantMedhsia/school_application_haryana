import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileCard from "../../components/Profile/ProfileCard";

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
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, [studentId]);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full bg-gray-900 text-white rounded-lg overflow-hidden">
      {studentData ? (
        <>
          <ProfileHeader userData={studentData} />

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

          <div className="flex flex-wrap gap-6 my-6">
            <section
              ref={personalInfoRef}
              className="flex-1 min-w-[48%] text-[#7367F0]"
            >
              <ProfileCard
                title="Personal Information"
                details={[
                  {
                    label: "Full Name",
                    value: `${studentData.firstName} ${studentData.lastName}`,
                  },
                  { label: "Gender", value: studentData.gender },
                  {
                    label: "Date of Birth",
                    value: new Date(
                      studentData.dateOfBirth
                    ).toLocaleDateString(),
                  },
                  { label: "Category", value: studentData.category },
                  { label: "Religion", value: studentData.religion },
                  { label: "Caste", value: studentData.caste },
                  { label: "Age", value: studentData.age },
                  { label: "Address", value: studentData.address },
                  { label: "Mobile", value: studentData.mobileNumber },
                  { label: "Email", value: studentData.email },
                ]}
              />
            </section>

            <section ref={academicDetailsRef} className="flex-1 min-w-[48%]">
              <ProfileCard
                title="Academic Details"
                details={[
                  {
                    label: "Admission Date",
                    value: new Date(
                      studentData.admissionDate
                    ).toLocaleDateString(),
                  },
                  { label: "Blood Group", value: studentData.bloodGroup },
                  { label: "House", value: studentData.house },
                  { label: "Height", value: `${studentData.height} feet` },
                  { label: "Weight", value: `${studentData.weight} kg` },
                  {
                    label: "Measurement Date",
                    value: new Date(
                      studentData.measurementDate
                    ).toLocaleDateString(),
                  },
                  {
                    label: "Medical History",
                    value: studentData.medicalHistory,
                  },
                ]}
              />
            </section>
          </div>

          <div className="flex flex-wrap gap-6 my-6">
            <section ref={participationsRef} className="flex-1 min-w-[48%]">
              <ProfileCard
                title="Participations"
                details={[
                  {
                    label: "Participation Details",
                    value: "No participation data available yet.",
                  },
                ]}
              />
            </section>

            <section ref={studentHistoryRef} className="flex-1 min-w-[48%]">
              <ProfileCard
                title="Student History"
                details={[
                  {
                    label: "History Details",
                    value: "No student history data available yet.",
                  },
                ]}
              />
            </section>
          </div>
        </>
      ) : (
        <div className="loader-wrapper">
          <span className="loader"></span>
        </div>
      )}
    </div>
  );
};

export default Profile;
