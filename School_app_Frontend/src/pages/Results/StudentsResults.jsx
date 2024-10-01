import React, { useState } from "react"; // Adjust the import path as necessary
import MultiRowValuesDatatable from "../../common/Datatables/MultiRowValuesDatatable";
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar";

const StudentsResults = () => {
  // Sample data
  const studentData = [
    {
      name: "John Doe",
      rollNumber: "23312",
      examTypes: ["Halfyearly", "Unit Test", "Internal"],
      percentage: [41.67, 64.86, 93.33],
      overallPercentage: 66.29,
      grade: "B",
    },
    {
      name: "Jane Smith",
      rollNumber: "23313",
      examTypes: ["Halfyearly", "Unit Test", "Internal"],
      percentage: [75.0, 85.71, 80.0],
      overallPercentage: 80.36,
      grade: "A++",
    },
    {
      name: "Sam Johnson",
      rollNumber: "23314",
      examTypes: ["Unit Test", "Internal, Halfyearly"],
      percentage: [100.0, 100.0, 100.0],
      overallPercentage: 100.0,
      grade: "A+",
    },
    {
      name: "John Doe",
      rollNumber: "23312",
      examTypes: ["Halfyearly", "Unit Test", "Internal"],
      percentage: [41.67, 64.86, 93.33],
      overallPercentage: 66.29,
      grade: "B",
    },
    {
      name: "Jane Smith",
      rollNumber: "23313",
      examTypes: ["Halfyearly", "Unit Test", "Internal"],
      percentage: [75.0, 85.71, 80.0],
      overallPercentage: 80.36,
      grade: "A++",
    },
    {
      name: "Sam Johnson",
      rollNumber: "23314",
      examTypes: ["Unit Test", "Internal, Halfyearly"],
      percentage: [100.0, 100.0, 100.0],
      overallPercentage: 100.0,
      grade: "A+",
    },
    {
      name: "John Doe",
      rollNumber: "23312",
      examTypes: ["Halfyearly", "Unit Test", "Internal"],
      percentage: [41.67, 64.86, 93.33],
      overallPercentage: 66.29,
    },
    {
      name: "Jane Smith",
      rollNumber: "23313",
      examTypes: ["Halfyearly", "Unit Test", "Internal"],
      percentage: [75.0, 85.71, 80.0],
      overallPercentage: 80.36,
    },
    {
      name: "Sam Johnson",
      rollNumber: "23314",
      examTypes: ["Unit Test", "Internal, Halfyearly"],
      percentage: [100.0, 100.0, 100.0],
      overallPercentage: 100.0,
    },
  ];

  const [term, setTerm] = useState("");
  const [classId, setClassId] = useState("");

  // Action handlers
  const actions = {
    onViewExam: (student, examType) => {
      console.log(`Viewing exam ${examType} for ${student.name}`);
      // Add your logic for viewing exam details here
    },
    onViewAll: (student) => {
      console.log(`Viewing all results for ${student.name}`);
      // Add your logic for viewing all results here
    },
  };

  const filterConfig = [
    {
      name: "term",
      label: "Select Term",
      placeholder: "Select Term",
      required: true,
      type: "select",
      options: teachers?.map((teacherItem) => ({
        label: teacherItem.name,
        value: teacherItem._id,
      })),
      onChange: handleTeacherChange,
    },
    {
      name: "class",
      label: "Select Class",
      placeholder: "Select Class",
      required: true,
      type: "select",
      options: teachers?.map((teacherItem) => ({
        label: teacherItem.name,
        value: teacherItem._id,
      })),
      onChange: handleTeacherChange,
    },
  ];

  return (
    <div className="">
      <DynamicFilterBar filters={filterConfig} onSubmit={handleFilterSubmit} />
      <h1 className="text-2xl font-bold mb-4 text-[#7367F0]">
        Students Results
      </h1>
      <MultiRowValuesDatatable data={studentData} actions={actions} />
    </div>
  );
};

export default StudentsResults;
