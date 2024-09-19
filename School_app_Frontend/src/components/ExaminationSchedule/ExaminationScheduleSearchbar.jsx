import React, { useEffect, useState } from "react";
import DynamicTable from "../../common/Datatables/DynamicTable"; // Import your dynamic table
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar"; // Import the dynamic filter bar
import FormButton from "../Form/FormButton";
import axios from "axios";

const ExaminationScheduleComponent = () => {
  const [examSubjects, setExamSubjects] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [filterConfig, setFilterConfig] = useState([]);
  const [terms, setTerms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjectGroups, setSubjectGroups] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [filteredSubjectGroups, setFilteredSubjectGroups] = useState([]);

  // Subject groups for pre-filling based on selected group
  // const subjectGroups = {
  //   C1: ["Hindi", "English", "Math"],
  //   C2: ["Science", "Social Studies", "Geography"],
  //   C3: ["Physics", "Chemistry", "Biology"],
  // };

  // Define columns for the table
  // const columns = [
  //   { header: "Subject", accessor: "subject", type: "text" },
  //   { header: "Exam Date", accessor: "examDate", type: "date" },
  //   { header: "Start Timing", accessor: "startTime", type: "time" },
  //   { header: "End Timing", accessor: "endTime", type: "time" },
  // ];

  // Filter configuration for DynamicFilterBar
  // const filterConfig = [
  //   {
  //     name: "term",
  //     label: "Select Term",
  //     placeholder: "Select Term",
  //     required: true,
  //     options: [
  //       { label: "Term-1", value: "Term-1" },
  //       { label: "Term-2", value: "Term-2" },
  //     ],
  //   },
  //   {
  //     name: "class",
  //     label: "Select Class",
  //     placeholder: "Select Class",
  //     required: true,
  //     options: [
  //       { label: "UKG", value: "UKG" },
  //       { label: "LKG", value: "LKG" },
  //     ],
  //   },
  //   {
  //     name: "subjectGroup",
  //     label: "Select Subject Group",
  //     placeholder: "Select Subject Group",
  //     required: true,
  //     options: [
  //       { label: "C1", value: "C1" },
  //       { label: "C2", value: "C2" },
  //       { label: "C3", value: "C3" },
  //     ],
  //   },
  //   {
  //     name: "examType",
  //     label: "Select Exam Type",
  //     placeholder: "Select Exam Type",
  //     required: true,
  //     options: [
  //       { label: "Half Yearly", value: "Half Yearly" },
  //       { label: "Final", value: "Final" },
  //     ],
  //   },
  // ];

  const columns = [
    { header: "Subject", accessor: "subject", type: "text" },
    { header: "Exam Date", accessor: "examDate", type: "date" },
    { header: "Start Timing", accessor: "startTime", type: "time" },
    { header: "End Timing", accessor: "endTime", type: "time" },
  ];

  useEffect(() => {
    if (selectedClass) {
      const relevantSubjectGroups = selectedClass.subjectGroups || [];
      setFilteredSubjectGroups(relevantSubjectGroups);
      console.log("Relevant subject groups", relevantSubjectGroups);
    } else {
      setFilteredSubjectGroups([]);
    }
  }, [selectedClass]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [termsResponse, classesResponse, examTypesResponse] =
          await Promise.all([
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-examgroup`),
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/all-class`),
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-examtype`),
          ]);

        // Set state with new data
        setTerms(termsResponse.data.data || []);
        setClasses(classesResponse.data.data || []);
        setExamTypes(examTypesResponse.data.data || []);

        // Extract and set subjectGroups
        const allSubjectGroups = classesResponse.data.data.flatMap((cls) =>
          cls.subjectGroups.map((group) => ({
            ...group,
            classId: cls._id,
            subjects: group.subjects || [],
          }))
        );
        console.log("All subject groups", allSubjectGroups);
        setFilteredSubjectGroups(allSubjectGroups);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilterConfig([
      {
        name: "term",
        label: "Select Term",
        placeholder: "Select Term",
        required: true,
        options: (terms || []).map((term) => ({
          label: term?.name || "Unknown",
          value: term?._id || "",
        })),
      },
      {
        name: "class",
        label: "Select Class",
        placeholder: "Select Class",
        required: true,
        options: (classes || []).map((cls) => ({
          label: cls?.name || "Unknown",
          value: cls?._id || "",
        })),
      },
      {
        name: "subjectGroup",
        label: "Select Subject Group",
        placeholder: "Select Subject Group",
        required: true,
        options: (filteredSubjectGroups || []).map((group) => ({
          label: group?.name || "Unknown",
          value: group?._id || "",
        })),
      },
      {
        name: "examType",
        label: "Select Exam Type",
        placeholder: "Select Exam Type",
        required: true,
        options: (examTypes || []).map((examType) => ({
          label: examType?.name || "Unknown",
          value: examType?._id || "",
        })),
      },
    ]);
  }, [terms, classes, filteredSubjectGroups, examTypes]);

  // Handles filter submission
  const handleFilterSubmit = (filterValues) => {
    const selectedSubjectGroup = filteredSubjectGroups.find(
      (group) => group._id === filterValues.subjectGroup
    );

    if (selectedSubjectGroup) {
      console.log("Selected subject group", selectedSubjectGroup.subjects);

      const subjects = selectedSubjectGroup.subjects.map((subject) => ({
        subject: subject.name,
        examDate: "",
        startTime: "",
        endTime: "",
      }));
      setExamSubjects(subjects);
      setShowTable(true);
    } else {
      setExamSubjects([]);
      setShowTable(false);
    }
  };

  // Handles input change for dynamic fields in the table
  const handleInputChange = (e, rowIndex, accessor) => {
    const updatedSubjects = [...examSubjects];
    updatedSubjects[rowIndex][accessor] = e.target.value;
    setExamSubjects(updatedSubjects);
  };

  // Handles row deletion
  const handleDelete = (indexToDelete) => {
    const updatedSubjects = examSubjects.filter(
      (_, index) => index !== indexToDelete
    );
    setExamSubjects(updatedSubjects);
  };

  return (
    <div className=" rounded-md">
      <div className="mb-4">
        <h2 className="text-[#7367F0] text-xl font-semibold">Filter Exams</h2>
      </div>

      {/* Reusable Filter Bar */}
      <DynamicFilterBar filters={filterConfig} onSubmit={handleFilterSubmit} />

      {/* Table is shown only after submitting */}
      {showTable && (
        <div>
          <div className="mb-4">
            <h2 className="text-[#7367F0] font-semibold mt-4 text-xl">
              Exam Schedule
            </h2>
          </div>

          <DynamicTable
            columns={columns}
            data={examSubjects}
            handleInputChange={handleInputChange}
            handleDelete={handleDelete}
          />

          <div className="flex justify-end mt-6">
            <FormButton name="Save" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExaminationScheduleComponent;
