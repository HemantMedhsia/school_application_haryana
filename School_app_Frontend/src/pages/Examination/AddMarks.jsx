import React, { useEffect, useState } from "react";
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar";
import DynamicTable from "../../common/Datatables/DynamicTable";
import FormButton from "../../components/Form/FormButton";
import { getAPI } from "../../utility/api/apiCall";
import axios from "axios";

const AddMarks = () => {
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
    setSubjectGroups(selectedClass ? selectedClass.subjectGroups : []);
    fetchStudents(selectedClassId); // Fetch students when class changes
  };

  const handleSubjectGroupChange = (selectedSubjectGroupId) => {
    const selectedSubjectGroup = subjectGroups.find((group) => group._id === selectedSubjectGroupId);
    setSubjects(selectedSubjectGroup ? selectedSubjectGroup.subjects : []);
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
      options: examTypes.map((examType) => ({ label: examType.name, value: examType._id })),
      onChange: (value) => setSelectedExamTypeId(value),
    },
    {
      name: "class",
      label: "Select Class",
      placeholder: "Select Class",
      required: true,
      type: "select",
      options: classes.map((classItem) => ({ label: classItem.name, value: classItem._id })),
      onChange: handleClassChange,
    },
    {
      name: "subjectGroup",
      label: "Select Subject Group",
      placeholder: "Select Subject Group",
      required: true,
      type: "select",
      options: subjectGroups.map((group) => ({ label: group.name, value: group._id })),
      onChange: handleSubjectGroupChange,
    },
    {
      name: "subject",
      label: "Select Subject",
      placeholder: "Select Subject",
      required: true,
      type: "select",
      options: subjects.map((subject) => ({ label: subject.name, value: subject._id })),
      onChange: (value) => setSelectedSubjectId(value),
    },
  ];

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

  const fetchStudents = async (classId) => {
    if (classId) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getallstudentsinfo/${classId}`);
        const mappedStudents = response.data.data.map(student => ({
          _id: student.id,
          name: student.name,
          rollNo: student.rollNumber,
          subject: student.subject || "", // Ensure there's a subject field
          obtainedMarks: "", // Initialize for input
        }));
        setStudentsData(mappedStudents);
      } catch (err) {
        console.error("Error fetching students", err);
      }
    }
  };

  const handleFilterSubmit = () => {
    if (!selectedTermId || !selectedExamTypeId || !selectedClassId || !selectedSubjectId) {
      alert("Please select all filter options.");
      return;
    }

    const filtered = studentsData.filter((student) => student.subject === selectedSubjectId);
    setFilteredStudents(filtered);
    setShowTable(true);
  };

  const handleInputChange = (e, rowIndex, columnAccessor) => {
    const updatedStudents = [...filteredStudents];
    updatedStudents[rowIndex][columnAccessor] = e.target.value;
    setFilteredStudents(updatedStudents);
  };

  const handleSave = async () => {
    if (!selectedClassId || !selectedTermId || !selectedExamTypeId || !selectedSubjectId) {
      alert("Please select all filter options before saving.");
      return;
    }

    const studentMarksArray = filteredStudents.map((student) => ({
      studentId: student._id,
      marksObtained: student.obtainedMarks,
    }));

    const dataToSend = {
      termId: selectedTermId,
      classId: selectedClassId,
      examTypeId: selectedExamTypeId,
      subjectId: selectedSubjectId,
      studentMarksArray,
    };

    try {
      console.log(dataToSend); // Call your save API here
      alert("Marks saved successfully!");
    } catch (error) {
      console.error("Error saving marks", error);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-[#7367F0] text-xl font-semibold">Add Marks</h2>
      </div>
      <DynamicFilterBar filters={filterConfig} onSubmit={handleFilterSubmit} />

      {showTable && (
        <div>
          <div className="mb-4">
            <h2 className="text-[#7367F0] font-semibold mt-4 text-xl">Student Marks Table</h2>
          </div>

          <DynamicTable
            columns={[
              { header: "Student Name", accessor: "name", type: "text" },
              { header: "Roll No", accessor: "rollNo", type: "text" },
              { header: "Subject", accessor: "subject", type: "text" },
              { header: "Max Marks", accessor: "maxMarks", type: "number" },
              {
                header: "Obtained Marks",
                accessor: "obtainedMarks",
                type: "number",
                inputType: "number",
              },
            ]}
            data={filteredStudents}
            handleInputChange={handleInputChange}
          />

          <div className="flex justify-end mt-6">
            <FormButton name="Save" onClick={handleSave} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMarks;
