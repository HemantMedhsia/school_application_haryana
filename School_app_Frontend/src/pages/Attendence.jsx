import React, { useState } from "react";
import AttendenceSearchBar from "../common/SearchBar/AttendenceSearchBar";
import Datatable from "../common/Datatables/Datatable";

const columns = [
  {
    header: "First Name",
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
    header: "Attendence Percentage",
    accessor: "attendencePercentage",
    render: (value, item) => {
        console.log("Render function called");
        const attendanceValue = parseFloat(value);
        console.log("Attendance Value:", attendanceValue);
        console.log("Item Color:", item.color);
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
    }
},
  {
    header: "Age",
    accessor: "age",
    
  },
  
];

const demoData = [
    { id: 1, firstName: "John", lastName: "Doe", rollNumber: "001", age: 15, attendencePercentage: "78", color: "#4CAF50" },
    { id: 2, firstName: "Jane", lastName: "Smith", rollNumber: "002", age: 16, attendencePercentage: "85", color: "#FF9800" },
    { id: 3, firstName: "Jim", lastName: "Brown", rollNumber: "003", age: 15, attendencePercentage: "60", color: "#F44336" },
    // Add more demo data as needed
  ];
  

const handlePresent = (id) => {
  console.log(`Student with ID ${id} marked as Present`);
  // Update the data or handle attendance logic here
};

const handleAbsent = (id) => {
  console.log(`Student with ID ${id} marked as Absent`);
  // Update the data or handle attendance logic here
};

const Attendence = () => {
  const [data, setData] = useState(demoData);

  const handleAttendance = (id, status) => {
    console.log(`Student with ID ${id} marked as ${status}`);
    // Update the data or handle attendance logic here
  };

  return (
    <div>
      <AttendenceSearchBar />
      <Datatable
        columns={columns}
        data={data}
        actions={{ onPresent: handlePresent, onAbsent: handleAbsent }}
      />
    </div>
  );
};

export default Attendence;
