import React, { useEffect, useState } from "react";
import MultiRowValuesDatatable from "../../common/Datatables/MultiRowValuesDatatable";
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar";
import { getAPI } from "../../utility/api/apiCall";
import axios from "axios";

const StudentsResults = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [term, setTerm] = useState([]);
  const [section, setSection] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAPI("getAllClasses", {}, setClasses),
          getAPI("getAllExamCategories", {}, setTerm),
          getAPI("getAllSections", {}, setSection),
        ]);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

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
  ];

  // Define the filter options
  const filters = [
    {
      name: "term",
      type: "select",
      placeholder: "Select Term",
      options: term.map((termItem) => ({
        label: termItem.name,
        value: termItem._id,
      })),
    },
    {
      name: "class",
      label: "Select Class",
      placeholder: "Select Class",
      required: true,
      type: "select",
      options: classes.map((classItem) => ({
        label: classItem.name,
        value: classItem._id,
      })),
    },
    {
      name: "section",
      type: "select",
      placeholder: "Select Section",
      options: section.map((sectionItem) => ({
        label: sectionItem.name,
        value: sectionItem._id,
      })),
    },
  ];

  // Action handlers
  const actions = {
    onViewExam: (student="", examType) => {
      console.log(`Viewing exam ${examType} for ${student.name}`);
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/api/get-exam-results`, {
          studentId: student._id,
          examType: examType,
        })
        .then((response) => {
          console.log("Exam results:", response.data);
          // Add your logic to handle the response data here
        })
        .catch((error) => {
          console.error("Error fetching exam results", error);
        });
    },
    onViewAll: (student) => {
      console.log(`Viewing all results for ${student.name}`);
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/api/get-all-results/${
            student._id
          }`
        )
        .then((response) => {
          console.log("All results:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching all results", error);
        });
    },
  };

  const handleFilterSubmit = (filterValues) => {
    console.log("Filter values:", filterValues);
    const filteredResults = studentData.filter((student) => {
      return true;
    });

    setFilteredData(filteredResults);
  };

  return (
    <div>
      <DynamicFilterBar filters={filters} onSubmit={handleFilterSubmit} />
      <div className="mt-4">
        <MultiRowValuesDatatable
          data={filteredData.length ? filteredData : studentData}
          actions={actions}
        />
      </div>
    </div>
  );
};

export default StudentsResults;
