import React, { useEffect, useState } from "react";
import TeacherSearchBar from "../../common/SearchBar/TeacherSearchBar";
import Datatable from "../../common/Datatables/Datatable";
import { getAPI } from "../../utility/api/apiCall";
import { Navigate } from "react-router-dom";

const columns = [
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Age",
    accessor: "age",
  },
  {
    header: "Gender",
    accessor: "gender",
  },
  {
    header: "Email",
    accessor: "email",
  },
  {
    header: "Subject",
    accessor: "subject",
  },
  {
    header: "Contact",
    accessor: "contact",
  },
  {
    header: "Address",
    accessor: "address",
  },
];

const handleView = (studentData) => {
  Navigate(`/school/profile/${studentData._id}`);
};

const handleEdit = (studentData) => {};

const handleDelete = async () => {};

const TeacherInfo = () => {
  const [allTeacherData, setAllTeacherData] = useState();

  const fetchData = async () => {
    try {
      const response = await getAPI("getAllTeachers", {}, setAllTeacherData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <TeacherSearchBar />
      <Datatable
        columns={columns}
        data={allTeacherData}
        actions={{
          onView: handleView,
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
      />
    </div>
  );
};

export default TeacherInfo;
