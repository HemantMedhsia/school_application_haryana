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
        `${import.meta.env.VITE_BACKEND_URL}/api/get-mark-by-class-and-exam-type/${classId}/${examType}`
      );
      console.log("Student marks data:", response.data.data);
      setStudentsData(response.data.data);
      setFilteredStudents(response.data.data);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching student marks data", error);
      toast.error("Failed to load student marks");
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
    const { class: classId, examType } = filterValues;
    setSelectedTermId(filterValues.term);
    setSelectedExamTypeId(examType);
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
          <h2 className="text-[#7367F0] font-semibold mt-4 text-xl">Student Marks Table</h2>
          <DynamicTable
            columns={[
              { header: "Student Name", accessor: "studentName", type: "text" },
              { header: "Roll No", accessor: "rollNumber", type: "text" },
              { header: "Subject", accessor: "subjectName", type: "text" },
              { header: "Marks Obtained", accessor: "marksObtained", type: "text" },
              {
                header: "View",
                accessor: "view",
                type: "button",
                render: (row) => (
                  <button onClick={() => viewDetails(row)} className="text-blue-500 underline">View</button>
                ),
              },
            ]}
            data={filteredStudents.map((student) => {
              const marks = student.marks.map(mark => ({
                subjectName: mark.subject.name, // Retrieve subject name from marks
                marksObtained: mark.marksObtained,
              }));

              return {
                studentName: student.student.firstName || "No name found",
                rollNumber: student.student.rollNumber || "No roll number found",
                subjectName: marks.length > 0 ? marks[0].subjectName : "No subject",
                marksObtained: marks.length > 0 ? marks[0].marksObtained : "N/A",
              };
            })}
          />
        </div>
      )}
      {showPopup && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Detailed Marks for {selectedStudent.student.firstName}</h3>
            <p>Roll No: {selectedStudent.student.rollNumber}</p>
            <p>Subject: {selectedStudent.subject.name}</p>
            <p>Marks Obtained: {selectedStudent.marks}</p>
            <button onClick={closePopup} className="mt-4 bg-blue-500 text-white p-2 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMarks;
