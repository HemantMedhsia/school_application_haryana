import React, { useEffect, useState } from "react";
import Datatable from "../common/Datatables/Datatable";
import SearchBar from "../common/SearchBar/SearchBar";
import { getAPI } from "../utility/api/apiCall";

const StudentInfo = () => {
  const [allStudentData, setAllStudentData] = useState([]);

  // Define columns for the student table with additional fields
  const columns = [
    {
      header: "Frist Name",
      accessor: "firstName",
    },
    {
      header: "Last Name",
      accessor: "lastName",
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
      accessor: (rowData) => rowData?.parent?.fatherName || "N/A"
    },
    {
      header: "Class",
      accessor: "currentClass.name",
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
      const response = await getAPI("getAllStudents", {}, setAllStudentData);
      if (response && Array.isArray(response)) {
        setAllStudentData(response);
      } else if (response && typeof response === "object") {
        setAllStudentData(response.data || []);
      } else {
        console.error("Unexpected response format:", response);
      }
      console.log("Data fetched successfully:", response);

      console.log(
        "Data fetched successfully:",
        await allStudentData[2].parent.fatherName
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleView = (studentData) => {
    console.log("Viewing parent data:", studentData);
  };

  const handleEdit = (studentData) => {
    console.log("Editing parent data:", studentData);
  };

  const handleDelete = (studentData) => {
    console.log("Deleting parent data:", studentData);
    // Add logic to delete the parent data from the server or state
  };

  return (
    <div className="">
      <SearchBar />
      <Datatable
        data={allStudentData}
        columns={columns}
        actions={{
          onView: handleView,
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
      />
    </div>
  );
};

export default StudentInfo;
