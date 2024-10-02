import React, { useEffect, useState } from "react";
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar";
import { getAPI } from "../../utility/api/apiCall";
import ResultTable from "./ResultTable";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";

const ShowStudentResult = () => {
  const [term, setTerm] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedTermName, setSelectedTermName] = useState(null);
  const [result, setResult] = useState(null);
  const { userRole } = useAuth();

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
    const selectedTermId = filterValues.term;

    const selectedTermItem = term.find(
      (termItem) => termItem._id === selectedTermId
    );
    const name = selectedTermItem ? selectedTermItem.name : null;

    setSelectedTerm(selectedTermId);
    setSelectedTermName(name);

    try {
      const authToken = localStorage.getItem("authToken");
      const endpoint =
        userRole === "Student"
          ? `${import.meta.env.VITE_BACKEND_URL}/api/show-student-result-byterm`
          : `${
              import.meta.env.VITE_BACKEND_URL
            }/api/show-student-result-byparent`;

      const resultResponse = await axios.post(
        endpoint,
        { term: selectedTermId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("Result response:", resultResponse.data);

      setResult(resultResponse.data);
    } catch (error) {
      console.error("Error fetching student results", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <DynamicFilterBar filters={filters} onSubmit={handleFilterSubmit} />

      {result && (
        <div className="mt-6">
          <ResultTable result={result} termName={selectedTermName} />
        </div>
      )}
    </div>
  );
};

export default ShowStudentResult;
