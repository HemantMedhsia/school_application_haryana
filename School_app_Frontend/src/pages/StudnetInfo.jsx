import React from "react";
import Datatable from "../common/Datatables/Datatable";

const StudentInfo = () => {
  // Sample student data with additional fields
  const studentData = [
    {
      name: "John Doe",
      rollNumber: "101",
      age: 16,
      class: "10th",
      section: "A",
      percentage: 85,
      attendance: "95%",
      grade: "A",
      remarks: "Excellent performance",
      color: "#3b82f6",
    },
    {
      name: "Jane Smith",
      rollNumber: "102",
      age: 15,
      class: "10th",
      section: "B",
      percentage: 78,
      attendance: "89%",
      grade: "B",
      remarks: "Good effort",
      color: "#a855f7",
    },
    {
      name: "Michael Johnson",
      rollNumber: "103",
      age: 17,
      class: "12th",
      section: "A",
      percentage: 92,
      attendance: "97%",
      grade: "A+",
      remarks: "Outstanding",
      color: "#f97316",
    },
    {
      name: "Emily Davis",
      rollNumber: "104",
      age: 16,
      class: "11th",
      section: "C",
      percentage: 66,
      attendance: "85%",
      grade: "C",
      remarks: "Needs improvement",
      color: "#ec4899",
    },
    {
      name: "David Brown",
      rollNumber: "105",
      age: 15,
      class: "9th",
      section: "D",
      percentage: 74,
      attendance: "91%",
      grade: "B",
      remarks: "Good but can do better",
      color: "#ff5b2e",
    },
  ];

  // Define columns for the student table with additional fields
  const columns = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Roll Number",
      accessor: "rollNumber",
    },
    {
      header: "Age",
      accessor: "age",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Section",
      accessor: "section",
    },
    {
      header: "Percentage",
      accessor: "percentage",
      render: (value, item) => (
        <div className="flex items-center">
          <span className="mr-2">{value}%</span>
          <div className="relative w-full">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-600">
              <div
                style={{
                  width: `${value}%`,
                  backgroundColor: item.color,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
              ></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Attendance",
      accessor: "attendance",
    },
    {
      header: "Grade",
      accessor: "grade",
    },
    {
      header: "Remarks",
      accessor: "remarks",
    },
  ];

  return (
    <div className="">
      <Datatable data={studentData} columns={columns} />
    </div>
  );
};

export default StudentInfo;
