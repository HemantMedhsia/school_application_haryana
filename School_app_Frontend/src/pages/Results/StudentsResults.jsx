import React from "react"; // Adjust the import path as necessary
import MultiRowValuesDatatable from "../../common/Datatables/MultiRowValuesDatatable";

const StudentsResults = () => {
  // Sample data
  const studentData = [
    {
      name: "John Doe",
      rollNumber: "23312",
      examTypes: ["Halfyearly", "Unit Test", "Internal"],
      percentage: [41.67, 64.86, 93.33],
    },
    {
      name: "Jane Smith",
      rollNumber: "23313",
      examTypes: ["Halfyearly", "Unit Test"],
      percentage: [75.0, 85.71],
    },
    {
      name: "Sam Johnson",
      rollNumber: "23314",
      examTypes: ["Unit Test", "Internal"],
      percentage: [100.0, 100.0],
    },
    // Add more student data as needed
  ];

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Students Results</h1>
      <MultiRowValuesDatatable data={studentData} actions={actions} />
    </div>
  );
};

export default StudentsResults;
