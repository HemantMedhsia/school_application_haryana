import React, { useEffect, useState } from "react";
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar";
import DynamicTable from "../../common/Datatables/DynamicTable";
import { getAPI } from "../../utility/api/apiCall";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewMarks = () => {
  const [showTable, setShowTable] = useState(false);
  const [studentsData, setStudentsData] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [terms, setTerms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [subjectGroups, setSubjectGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTermId, setSelectedTermId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedExamTypeId, setSelectedExamTypeId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleClassChange = (selectedClassId) => {
    setSelectedClassId(selectedClassId);
    const selectedClass = classes.find((cls) => cls._id === selectedClassId);
    setSubjectGroups(selectedClass ? selectedClass.subjectGroups : []);
  };

  const handleSubjectGroupChange = (selectedSubjectGroupId) => {
    const selectedSubjectGroup = subjectGroups.find(
      (group) => group._id === selectedSubjectGroupId
    );
    setSubjects(selectedSubjectGroup ? selectedSubjectGroup.subjects : []);
  };

  const fetchStudentMarks = async (classId, examType) => {
    if (!classId || !examType) return;
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/get-mark-by-class-and-exam-type/${classId}/${examType}`
      );
      console.log("Student marks data:", response.data.data);
      setStudentsData(response.data.data);

      const filteredData = response.data.data.filter((student) =>
        student.marks.some((mark) => mark.subject._id === selectedSubjectId)
      );

      console.log("Filtered data:", filteredData);

      if (filteredData.length === 0) {
        toast.error("No data found for the selected subject");

        setShowTable(false);
        return;
      }
      setFilteredStudents(filteredData);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching student marks data", error);
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to load student marks";

      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAPI("getAllExamTypes", {}, setExamTypes),
          getAPI("getAllClasses", {}, setClasses),
          getAPI("getAllExamCategories", {}, setTerms),
        ]);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handleFilterSubmit = async (filterValues) => {
    const { class: classId, examType, subject } = filterValues;
    setSelectedTermId(filterValues.term);
    setSelectedExamTypeId(examType);
    setSelectedSubjectId(subject);
    await fetchStudentMarks(classId, examType);
  };

  const viewDetails = (student) => {
    setSelectedStudent(student);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedStudent(null);
  };

  const filterConfig = [
    {
      name: "term",
      label: "Select Term",
      placeholder: "Select Term",
      required: true,
      type: "select",
      options: terms.map((term) => ({ label: term.name, value: term._id })),
      onChange: (value) => setSelectedTermId(value),
    },
    {
      name: "examType",
      label: "Select Exam Type",
      placeholder: "Select Exam Type",
      required: true,
      type: "select",
      options: examTypes.map((exam) => ({
        label: exam.name,
        value: exam._id,
      })),
      onChange: (value) => setSelectedExamTypeId(value),
    },
    {
      name: "class",
      label: "Select Class",
      placeholder: "Select Class",
      required: true,
      type: "select",
      options: classes.map((classItem) => ({
        label: classItem.name,
        value: classItem._id,
      })),
      onChange: handleClassChange,
    },
    {
      name: "subjectGroup",
      label: "Select Subject Group",
      placeholder: "Select Subject Group",
      required: true,
      type: "select",
      options: subjectGroups.map((group) => ({
        label: group.name,
        value: group._id,
      })),
      onChange: handleSubjectGroupChange,
    },
    {
      name: "subject",
      label: "Select Subject",
      placeholder: "Select Subject",
      required: true,
      type: "select",
      options: subjects.map((sub) => ({
        label: sub.name,
        value: sub._id,
      })),
      onChange: (value) => setSelectedSubjectId(value),
    },
  ];

  return (
    <div>
      <ToastContainer />
      <h2 className="text-[#7367F0] text-xl font-semibold">View Marks</h2>
      <DynamicFilterBar filters={filterConfig} onSubmit={handleFilterSubmit} />

      {showTable && (
        <div>
          <h2 className="text-[#7367F0] font-semibold mt-4 text-xl">
            Student Marks Table
          </h2>
          <DynamicTable
            columns={[
              { header: "Student Name", accessor: "studentName", type: "text" },
              { header: "Roll No", accessor: "rollNumber", type: "text" },
              { header: "Subject", accessor: "subjectName", type: "text" },
              {
                header: "Max Marks",
                accessor: "maxMarks",
                type: "text",
              },
              {
                header: "Marks Obtained",
                accessor: "marksObtained",
                type: "text",
              },
            ]}
            data={filteredStudents
              .map((student) => {
                return student.marks
                  .filter((mark) => mark.subject._id === selectedSubjectId)
                  .map((mark) => {
                    const exam = mark.exams[0];
                    return {
                      studentName: student.student.firstName || "No name found",
                      rollNumber:
                        student.student.rollNumber || "No roll number found",
                      subjectName: mark.subject.name || "No subject",
                      maxMarks: exam ? exam.examType.maxMarks : "N/A",
                      marksObtained: exam ? exam.marksObtained : "N/A",
                    };
                  });
              })
              .flat()}
          />
        </div>
      )}
      {showPopup && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              Detailed Marks for {selectedStudent.student.firstName}
            </h3>
            <p>Roll No: {selectedStudent.student.rollNumber}</p>
            <p>Subject: {selectedStudent.subject.name}</p>
            <p>Marks Obtained: {selectedStudent.marks}</p>
            <button
              onClick={closePopup}
              className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMarks;
