import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileCard from "../../components/Profile/ProfileCard";
import { useParams } from "react-router-dom";

const TeacherProfile = () => {
  const { teacherId } = useParams();
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const personalInfoRef = useRef(null);
  const qualificationInfoRef = useRef(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/get-single-teacher/${teacherId}`
        );
        setTeacherData(response.data.data);
      } catch (error) {
        setError("Error fetching teacher data");
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacherId]);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="loader-wrapper">
        <span className="loader"></span>
      </div>
    );
  if (error) return <span className="text-red-500">{error}</span>;

  return (
    <div className="w-full bg-gray-900 text-white rounded-lg overflow-hidden">
      {teacherData && (
        <>
          <ProfileHeader
            userData={{
              name: teacherData.name,
              profileImage: teacherData.profileImage,
              email: teacherData.email,
              role: teacherData.role,
            }}
          />

          <div className="flex justify-around items-center rounded-b-md py-4 bg-gray-900">
            <button
              className="text-[#65FA9E] hover:text-[#286C56]"
              onClick={() => scrollToSection(personalInfoRef)}
            >
              Personal Information
            </button>
            <button
              className="text-[#65FA9E] hover:text-[#286C56]"
              onClick={() => scrollToSection(qualificationInfoRef)}
            >
              Qualifications & Experience
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
                  { label: "Name", value: teacherData.name },
                  { label: "Age", value: teacherData.age },
                  { label: "Gender", value: teacherData.gender },
                  { label: "Subject", value: teacherData.subject },
                  { label: "Email", value: teacherData.email },
                  { label: "Contact", value: teacherData.contact },
                  { label: "Address", value: teacherData.address },
                ]}
                photo={teacherData.profileImage}
              />
            </section>

            <section ref={qualificationInfoRef} className="flex-1 min-w-[48%]">
              <ProfileCard
                title="Qualifications & Experience"
                details={[
                  { label: "Qualification", value: teacherData.qualification },
                  { label: "Experience", value: teacherData.experience },
                  { label: "Adhar No", value: teacherData.adharNo },
                  { label: "PAN No", value: teacherData.panNo },
                ]}
              />
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherProfile;
