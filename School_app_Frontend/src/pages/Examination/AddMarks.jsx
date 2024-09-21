import React, { useEffect, useState } from "react";
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar";
import DynamicTable from "../../common/Datatables/DynamicTable";
import FormButton from "../../components/Form/FormButton";
import { getAPI } from "../../utility/api/apiCall";

// Dummy data for students
const dummyStudents = [
  {
    name: "John Doe",
    rollNo: "101",
    subject: "Hindi",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Jane Smith",
    rollNo: "102",
    subject: "English",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Mary Johnson",
    rollNo: "103",
    subject: "Math",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Alice Brown",
    rollNo: "104",
    subject: "Hindi",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Michael White",
    rollNo: "105",
    subject: "English",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Chris Davis",
    rollNo: "106",
    subject: "Math",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Emma Wilson",
    rollNo: "107",
    subject: "Hindi",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Olivia Taylor",
    rollNo: "108",
    subject: "English",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "James Anderson",
    rollNo: "109",
    subject: "Math",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Sophia Thomas",
    rollNo: "110",
    subject: "Hindi",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Liam Martinez",
    rollNo: "111",
    subject: "English",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Noah Jackson",
    rollNo: "112",
    subject: "Math",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Mason Lee",
    rollNo: "113",
    subject: "Hindi",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Isabella Harris",
    rollNo: "114",
    subject: "English",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Lucas Clark",
    rollNo: "115",
    subject: "Math",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Ava Lewis",
    rollNo: "116",
    subject: "Hindi",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Mia Robinson",
    rollNo: "117",
    subject: "English",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Ethan Hall",
    rollNo: "118",
    subject: "Math",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Amelia Young",
    rollNo: "119",
    subject: "Hindi",
    maxMarks: 100,
    obtainedMarks: "",
  },
  {
    name: "Harper Allen",
    rollNo: "120",
    subject: "English",
    maxMarks: 100,
    obtainedMarks: "",
  },
];

const AddMarks = () => {
  const [showTable, setShowTable] = useState(false);
  const [studentsData, setStudentsData] = useState(dummyStudents);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [terms, setTerms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [subjectGroups, setSubjectGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Move handleClassChange function above the filterConfig
  const handleClassChange = (selectedClassId) => {
    const selectedClass = classes.find((cls) => cls._id === selectedClassId);
    console.log("Selected Class:", selectedClass);

    if (selectedClass) {
      setSubjectGroups(selectedClass.subjectGroups || []);
    } else {
      setSubjectGroups([]); // Clear subject groups if no class is selected
    }
  };

  const handleSubjectGroupChange = (selectedSubjectGroupId) => {
    const selectedSubjectGroup = subjectGroups.find(
      (group) => group._id === selectedSubjectGroupId
    );
    console.log("Selected Subject Group:", selectedSubjectGroup);

    if (selectedSubjectGroup) {
      // Fetch subjects based on selected subject group
      setSubjects(selectedSubjectGroup.subjects || []);
    }
    else{
      setSubjects([]);
    }
  }

  // Now define the filterConfig
  const filterConfig = [
    {
      name: "term",
      label: "Select Term",
      placeholder: "Select Term",
      required: true,
      type: "select",
      options: (terms || []).map((term) => ({
        label: term?.name || "Unknown",
        value: term?._id || "",
      })),
    },
    {
      name: "examType",
      label: "Select Exam Type",
      placeholder: "Select Exam Type",
      required: true,
      type: "select",
      options: (examTypes || []).map((term) => ({
        label: term?.name || "Unknown",
        value: term?._id || "",
      })),
    },
    {
      name: "class",
      label: "Select Class",
      placeholder: "Select Class",
      required: true,
      type: "select",
      options: (classes || []).map((classItem) => ({
        label: classItem?.name || "Unknown",
        value: classItem?._id || "",
      })),
      onChange: handleClassChange,
    },
    
    {
      name: "subjectGroup",
      label: "Select Subject Group",
      placeholder: "Select Subject Group",
      required: true,
      type: "select",
      options: (subjectGroups || []).map((group) => ({
        label: group?.name || "Unknown",
        value: group?._id || "",
      })),
      onChange: handleSubjectGroupChange,
    },
    {
      name: "subject",
      label: "Select Subject",
      placeholder: "Select Subject",
      required: true,
      type: "select",
      options: (subjects || []).map((group) => ({
        label: group?.name || "Unknown",
        value: group?._id || "",
      })),
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

  const handleFilterSubmit = (filterValues) => {
    console.log("Submitted Filter Values:", filterValues);

    const filtered = dummyStudents.filter(
      (student) => student.subject === filterValues.subject && true // Additional filtering logic if needed
    );

    setFilteredStudents(filtered);
    setShowTable(true); // Show table after filtering
  };

  const handleInputChange = (e, rowIndex, columnAccessor) => {
    const updatedStudents = [...filteredStudents];
    updatedStudents[rowIndex][columnAccessor] = e.target.value;
    setFilteredStudents(updatedStudents);
  };

  const handleSave = () => {
    console.log("Saved Data:", filteredStudents);
    alert("Marks saved successfully!");
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
            <h2 className="text-[#7367F0] font-semibold mt-4 text-xl">
              Student Marks Table
            </h2>
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
