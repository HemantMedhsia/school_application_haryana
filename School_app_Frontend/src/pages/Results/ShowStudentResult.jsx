import React, { useEffect, useState } from "react";
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar";
import { getAPI } from "../../utility/api/apiCall";
import ResultTable from "./ResultTable";
import axios from "axios";

const ShowStudentResult = () => {
  const [term, setTerm] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAPI("getAllExamCategories", {}, setTerm);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

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
  ];

  const handleFilterSubmit = async (filterValues) => {
    console.log("Filter values:", filterValues);
    setSelectedTerm(filterValues.term);

    try {
      const authToken = localStorage.getItem("authToken");

      const resultResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/show-student-result-byterm`,
        {
          term: filterValues.term,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include auth token in request header
          },
        }
      );

      setResult(resultResponse.data); // Set the fetched result data
    } catch (error) {
      console.error("Error fetching student results", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <DynamicFilterBar filters={filters} onSubmit={handleFilterSubmit} />

      {result && (
        <div className="mt-6">
          <ResultTable result={result} />
        </div>
      )}
    </div>
  );
};

export default ShowStudentResult;
