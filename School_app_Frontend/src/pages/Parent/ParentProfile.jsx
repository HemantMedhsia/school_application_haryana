import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileCard from "../../components/Profile/ProfileCard";

const ParentProfile = () => {
  const { parentId } = useParams();
  const [parentData, setParentData] = useState(null);
  const [studentData, setStudentData] = useState([]);

  const personalInfoRef = useRef(null);
  const guardianInfoRef = useRef(null);
  const studentInfoRef = useRef(null);

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const response = await axios(
          `${import.meta.env.VITE_BACKEND_URL}/api/get-parent/${parentId}`
        );
        setParentData(response.data.data);
      } catch (error) {
        console.error("Error fetching parent data:", error);
      }
    };

    fetchParentData();
  }, [parentId]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/get-student-by-parent/${parentId}`
        );
        setStudentData(response.data.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, [parentId]);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const student = studentData.length > 0 ? studentData[0] : null;

  return (
    <div className="w-full bg-gray-900 text-white rounded-lg overflow-hidden">
      {parentData ? (
        <>
          <ProfileHeader userData={parentData} />

          <div className="flex justify-around items-center rounded-b-md py-4 bg-gray-900">
            <button
              className="text-[#65FA9E] hover:text-[#286C56]"
              onClick={() => scrollToSection(personalInfoRef)}
            >
              Parent Information
            </button>
            <button
              className="text-[#65FA9E] hover:text-[#286C56]"
              onClick={() => scrollToSection(guardianInfoRef)}
            >
              Guardian Information
            </button>
            <button
              className="text-[#65FA9E] hover:text-[#286C56]"
              onClick={() => scrollToSection(studentInfoRef)}
            >
              Student Information
            </button>
          </div>

          {/* Parent and Guardian Information Sections */}
          <div className="flex flex-wrap gap-6 my-6">
            <section
              ref={personalInfoRef}
              className="flex-1 min-w-[48%] text-[#7367F0]"
            >
              <ProfileCard
                title="Parent Information"
                details={[
                  { label: "Father's Name", value: parentData.fatherName },
                  { label: "Father's Phone", value: parentData.fatherPhone },
                  {
                    label: "Father's Occupation",
                    value: parentData.fatherOccupation,
                  },
                  { label: "Mother's Name", value: parentData.motherName },
                  { label: "Mother's Phone", value: parentData.motherPhone },
                  {
                    label: "Mother's Occupation",
                    value: parentData.motherOccupation,
                  },
                ]}
              />
            </section>

            <section ref={guardianInfoRef} className="flex-1 min-w-[48%]">
              <ProfileCard
                title="Guardian Information"
                details={[
                  { label: "Guardian Is", value: parentData.guardianIs },
                  { label: "Guardian's Name", value: parentData.guardianName },
                  {
                    label: "Guardian's Relation",
                    value: parentData.guardianRelation,
                  },
                  {
                    label: "Guardian's Phone",
                    value: parentData.guardianPhone,
                  },
                  { label: "Email", value: parentData.email },
                  { label: "Address", value: parentData.guardianAddress },
                ]}
              />
            </section>

            <section ref={studentInfoRef} className="flex-1 min-w-[48%]">
              {student ? (
                <ProfileCard
                  title="Student Information"
                  details={[
                    {
                      label: "Student Name",
                      value: `${student.firstName} ${student.lastName}`,
                    },
                    { label: "Roll Number", value: student.rollNumber },
                    { label: "Email", value: student.email },
                    { label: "Mobile Number", value: student.mobileNumber },
                    {
                      label: "Date of Birth",
                      value: new Date(student.dateOfBirth).toLocaleDateString(),
                    },
                    {
                      label: "Class",
                      value:
                        typeof student.currentClass === "object"
                          ? student.currentClass.name
                          : student.currentClass,
                    },
                    { label: "Address", value: student.address },
                  ]}
                />
              ) : (
                <p>No student data available.</p>
              )}
            </section>

            <section
              ref={studentInfoRef}
              className="flex-1 min-w-[48%]"
            ></section>
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

export default ParentProfile;
