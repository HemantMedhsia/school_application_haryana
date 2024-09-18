import React, { useState } from "react";
import DynamicTable from "../Datatables/DynamicTable"; // Import your dynamic table
import DynamicFilterBar from "../FilterBar/DynamicFilterBar"; // Import the dynamic filter bar
import FormButton from "../../components/Form/FormButton";

const ExaminationScheduleSearchbar = () => {
  const [examSubjects, setExamSubjects] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");

  // Subject groups for pre-filling based on selected group
  const subjectGroups = {
    C1: ["Hindi", "English", "Math"],
    C2: ["Science", "Social Studies", "Geography"],
    C3: ["Physics", "Chemistry", "Biology"],
  };

  // Define columns for the table
  const columns = [
    { header: "Subject", accessor: "subject", type: "text" },
    { header: "Exam Date", accessor: "examDate", type: "date" },
    { header: "Start Timing", accessor: "startTime", type: "time" },
    { header: "End Timing", accessor: "endTime", type: "time" },
  ];

  // Filter configuration for DynamicFilterBar
  const filterConfig = [
    {
      name: "term",
      label: "Select Term",
      placeholder: "Select Term",
      required: true,
      options: [
        { label: "Term-1", value: "Term-1" },
        { label: "Term-2", value: "Term-2" },
      ],
    },
    {
      name: "class",
      label: "Select Class",
      placeholder: "Select Class",
      required: true,
      options: [
        { label: "UKG", value: "UKG" },
        { label: "LKG", value: "LKG" },
      ],
    },
    {
      name: "subjectGroup",
      label: "Select Subject Group",
      placeholder: "Select Subject Group",
      required: true,
      options: [
        { label: "C1", value: "C1" },
        { label: "C2", value: "C2" },
        { label: "C3", value: "C3" },
      ],
    },
    {
      name: "examType",
      label: "Select Exam Type",
      placeholder: "Select Exam Type",
      required: true,
      options: [
        { label: "Half Yearly", value: "Half Yearly" },
        { label: "Final", value: "Final" },
      ],
    },
  ];

  // Handles filter submission
  const handleFilterSubmit = (filterValues) => {
    if (filterValues.subjectGroup && subjectGroups[filterValues.subjectGroup]) {
      const subjects = subjectGroups[filterValues.subjectGroup].map(
        (subject) => ({
          subject,
          examDate: "",
          startTime: "",
          endTime: "",
        })
      );
      setExamSubjects(subjects);
      setShowTable(true);
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
            <h2 className="text-[#7367F0] font-semibold mt-4 text-xl">Exam Schedule</h2>
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

export default ExaminationScheduleSearchbar;
