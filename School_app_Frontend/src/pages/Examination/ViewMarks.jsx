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

  const handleClassChange = (selectedClassId) => {
    setSelectedClassId(selectedClassId);
    const selectedClass = classes.find((cls) => cls._id === selectedClassId);
    if (selectedClass) {
      setSubjectGroups(selectedClass.subjectGroups || []);
    } else {
      setSubjectGroups([]);
    }
  };

  const handleSubjectGroupChange = (selectedSubjectGroupId) => {
    const selectedSubjectGroup = subjectGroups.find(
      (group) => group._id === selectedSubjectGroupId
    );
    if (selectedSubjectGroup) {
      setSubjects(selectedSubjectGroup.subjects || []);
    } else {
      setSubjects([]);
    }
  };

  const handleSubjectChange = (selectedSubjectId) => {
    setSelectedSubjectId(selectedSubjectId);
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
      options: (examTypes || []).map((exam) => ({
        label: exam?.name || "Unknown",
        value: exam?._id || "",
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
      options: (subjects || []).map((sub) => ({
        label: sub?.name || "Unknown",
        value: sub?._id || "",
      })),
      onChange: handleSubjectChange,
    },
  ];

  const fetchStudentMarks = async (classId, examType) => {
    if (!classId || !examType) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/view-marks/${classId}/${examType}`
      );
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
    const { class: classId, examType, subject, term } = filterValues;
    setSelectedTermId(term);
    setSelectedExamTypeId(examType);
    await fetchStudentMarks(classId, examType);
  };

  return (
    <div>
      <ToastContainer />
      <div className="mb-4">
        <h2 className="text-[#7367F0] text-xl font-semibold">View Marks</h2>
      </div>
      <DynamicFilterBar filters={filterConfig} onSubmit={handleFilterSubmit} />
      
      {showTable && (
        <div>
          <div className="mb-4">
            <h2 className="text-[#7367F0] font-semibold mt-4 text-xl">
              Student Marks Table
            </h2>
          </div>
          <DynamicTable
            columns={[
              { header: "Student Name", accessor: "name", type: "text" },
              { header: "Roll No", accessor: "rollNo", type: "text" },
              { header: "Subject", accessor: "subject", type: "text" },
              { header: "Obtained Marks", accessor: "obtainedMarks", type: "number" },
              { header: "Max Marks", accessor: "maxMarks", type: "number" },
            ]}
            data={filteredStudents}
          />
        </div>
      )}
    </div>
  );
};

export default ViewMarks;
