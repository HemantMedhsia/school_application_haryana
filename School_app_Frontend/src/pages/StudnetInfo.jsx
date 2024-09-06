import React, { useEffect, useState } from "react";
import Datatable from "../common/Datatables/Datatable";
import SearchBar from "../common/SearchBar/SearchBar";
import { getAPI } from "../utility/api/apiCall";

const StudentInfo = () => {
  const [allStudentData, setAllStudentData] = useState([]);
  // Sample student data with additional fields
  const studentData = [
    {
      name: "John Doe",
      rollNumber: "101",
      age: 16,
      fatherName: "Mr. Doe",
      class: "10th",
      section: "A",
      attendance: "95%",
      grade: "A",
      color: "#3b82f6",
    },
    {
      name: "Jane Smith",
      rollNumber: "102",
      age: 15,
      class: "10th",
      section: "B",
      attendance: "89%",
      grade: "B",
      color: "#a855f7",
    },
    {
      name: "Michael Johnson",
      rollNumber: "103",
      age: 17,
      class: "12th",
      section: "A",
      attendance: "97%",
      grade: "A+",
      color: "#f97316",
    },
    {
      name: "Emily Davis",
      rollNumber: "104",
      age: 16,
      class: "11th",
      section: "C",
      attendance: "85%",
      grade: "C",
      color: "#ec4899",
    },
    {
      name: "David Brown",
      rollNumber: "105",
      age: 15,
      class: "9th",
      section: "D",
      attendance: "91%",
      grade: "B",
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
      header: "Father Name",
      accessor: "fatherName",
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
      header: "Attendance",
      accessor: "attendance",
      render: (value, item) => {
        const attendanceValue = parseFloat(value);
        return (
          <div className="flex items-center">
            <span className="mr-2">{value}</span>
            <div className="relative w-full">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-600">
                <div
                  style={{
                    width: `${attendanceValue}%`,
                    backgroundColor: item.color,
                  }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                ></div>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Grade",
      accessor: "grade",
    },
  ];

  const fetchData = async () => {
    try {
      const [AllStudentResponse] = await Promise.all([
        getAPI("getAllStudents", {}, setAllStudentData),
      ]);
      console.log(AllStudentResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="">
      <SearchBar />
      <Datatable data={studentData} columns={columns} />
    </div>
  );
};

export default StudentInfo;
