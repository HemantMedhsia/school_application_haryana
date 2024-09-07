import React, { useEffect, useState } from "react";
import Datatable from "../common/Datatables/Datatable";
import SearchBar from "../common/SearchBar/SearchBar";
import { getAPI } from "../utility/api/apiCall";

const ParentInfo = () => {
  const [allParentData, setAllParentData] = useState([]);

  const parentData = [
    {
      fatherName: "John Doe",
      fatherPhone: "123-456-7890",
      motherName: "Jane Doe",
      guardianName: "Mr. Smith",
      email: "john.doe@example.com",
      guardianAddress: "123 Main St, Cityville",
    },
    {
      fatherName: "Michael Smith",
      fatherPhone: "987-654-3210",
      motherName: "Maria Smith",
      guardianName: "Mrs. Johnson",
      email: "michael.smith@example.com",
      guardianAddress: "456 Oak St, Townville",
    },
    {
      fatherName: "David Johnson",
      fatherPhone: "555-123-4567",
      motherName: "Sarah Johnson",
      guardianName: "Mr. Lee",
      email: "david.johnson@example.com",
      guardianAddress: "789 Pine St, Villagetown",
    },
    {
      fatherName: "Chris Brown",
      fatherPhone: "444-555-6666",
      motherName: "Emma Brown",
      guardianName: "Mrs. Clark",
      email: "chris.brown@example.com",
      guardianAddress: "321 Maple St, Hamletville",
    },
    {
      fatherName: "James Wilson",
      fatherPhone: "333-444-7777",
      motherName: "Lily Wilson",
      guardianName: "Mr. Adams",
      email: "james.wilson@example.com",
      guardianAddress: "654 Birch St, Metropolis",
    },
  ];

  const columns = [
    {
      header: "Father's Name",
      accessor: "fatherName",
    },
    {
      header: "Father's Phone",
      accessor: "fatherPhone",
    },
    {
      header: "Mother's Name",
      accessor: "motherName",
    },

    {
      header: "Guardian's Name",
      accessor: "guardianName",
    },

    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Guardian's Address",
      accessor: "guardianAddress",
    },
  ];

  const fetchData = async () => {
    // try {
    //   const [AllParentResponse] = await Promise.all([
    //     getAPI("getAllStudents", {}, setAllParentData),
    //   ]);
    //   console.log(AllParentResponse);
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }
  };

  useEffect(() => {
    // fetchData();
  }, []);

  const handleView = (parentData) => {
    console.log("Viewing parent data:", parentData);
  };

  const handleEdit = (parentData) => {
    console.log("Editing parent data:", parentData);
  };

  const handleDelete = (parentData) => {
    console.log("Deleting parent data:", parentData);
    // Add logic to delete the parent data from the server or state
  };

  return (
    <div className="">
      <SearchBar />
      <Datatable
        data={parentData}
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

export default ParentInfo;
