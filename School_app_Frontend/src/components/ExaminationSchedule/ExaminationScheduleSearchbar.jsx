import React, { useEffect, useState } from "react";
import DynamicTable from "../../common/Datatables/DynamicTable"; // Import your dynamic table
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar"; // Import the dynamic filter bar
import FormButton from "../Form/FormButton";
import axios from "axios";

const ExaminationScheduleComponent = () => {
  const [examSubjects, setExamSubjects] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [filterConfig, setFilterConfig] = useState([]);
  const [terms, setTerms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjectGroups, setSubjectGroups] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [filteredSubjectGroups, setFilteredSubjectGroups] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    term: null,
    class: null,
    subjectGroup: null,
    examType: null,
  });

  // Helper function to format dates and times safely
  const formatDate = (value) => {
    const date = new Date(value);
    return isNaN(date) ? "" : date.toLocaleDateString(); // Format as 'MM/DD/YYYY'
  };

  const formatTime = (value) => {
    const time = new Date(`1970-01-01T${value}Z`); // Use any valid date for time parsing
    return isNaN(time)
      ? ""
      : time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    if (selectedClass) {
      const relevantSubjectGroups = selectedClass.subjectGroups || [];
      setFilteredSubjectGroups(relevantSubjectGroups);
      console.log("Relevant subject groups", relevantSubjectGroups);
    } else {
      setFilteredSubjectGroups([]);
    }
  }, [selectedClass]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [termsResponse, classesResponse, examTypesResponse] =
          await Promise.all([
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-examgroup`),
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/all-class`),
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-examtype`),
          ]);

        setTerms(termsResponse.data.data || []);
        setClasses(classesResponse.data.data || []);
        setExamTypes(examTypesResponse.data.data || []);

        const allSubjectGroups = classesResponse.data.data.flatMap((cls) =>
          cls.subjectGroups.map((group) => ({
            ...group,
            classId: cls._id,
            subjects: group.subjects || [],
          }))
        );
        console.log("All subject groups", allSubjectGroups);
        setFilteredSubjectGroups(allSubjectGroups);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilterConfig([
      {
        name: "term",
        label: "Select Term",
        placeholder: "Select Term",
        required: true,
        options: (terms || []).map((term) => ({
          label: term?.name || "Unknown",
          value: term?._id || "",
        })),
      },
      {
        name: "class",
        label: "Select Class",
        placeholder: "Select Class",
        required: true,
        options: (classes || []).map((cls) => ({
          label: cls?.name || "Unknown",
          value: cls?._id || "",
        })),
      },
      {
        name: "subjectGroup",
        label: "Select Subject Group",
        placeholder: "Select Subject Group",
        required: true,
        options: (filteredSubjectGroups || []).map((group) => ({
          label: group?.name || "Unknown",
          value: group?._id || "",
        })),
      },
      {
        name: "examType",
        label: "Select Exam Type",
        placeholder: "Select Exam Type",
        required: true,
        options: (examTypes || []).map((examType) => ({
          label: examType?.name || "Unknown",
          value: examType?._id || "",
        })),
      },
    ]);
  }, [terms, classes, filteredSubjectGroups, examTypes]);

  const handleFilterSubmit = (filterValues) => {
    const selectedSubjectGroup = filteredSubjectGroups.find(
      (group) => group._id === filterValues.subjectGroup
    );

    if (selectedSubjectGroup) {
      console.log("Selected subject group", selectedSubjectGroup.subjects);

      const subjects = selectedSubjectGroup.subjects.map((subject) => ({
        subject: subject._id,
        examDate: null, // Initialize dates and times as null
        startTime: null,
        endTime: null,
      }));
      setExamSubjects(subjects);
      setShowTable(true);
    } else {
      setExamSubjects([]);
      setShowTable(false);
    }

    setSelectedFilters(filterValues);
  };

  const handleInputChange = (e, rowIndex, accessor) => {
    const updatedSubjects = [...examSubjects];
    updatedSubjects[rowIndex][accessor] = e.target.value;
    setExamSubjects(updatedSubjects);
  };

  const handleDelete = (indexToDelete) => {
    const updatedSubjects = examSubjects.filter(
      (_, index) => index !== indexToDelete
    );
    setExamSubjects(updatedSubjects);
  };

  const handleSave = async () => {
    try {
      const payload = {
        term: selectedFilters.term,
        classId: selectedFilters.class,
        examType: selectedFilters.examType,
        subjectGroup: selectedFilters.subjectGroup,
        examDetails: [...examSubjects],
      };

      console.log("Payload", payload);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/create-examschedule`,
        payload
      );

      if (response.status === 201) {
        console.log("Exam schedule saved successfully");
      }
    } catch (error) {
      console.error("Error saving exam schedule", error);
    }
  };

  return (
    <div className=" rounded-md">
      <div className="mb-4">
        <h2 className="text-[#7367F0] text-xl font-semibold">Filter Exams</h2>
      </div>

      <DynamicFilterBar filters={filterConfig} onSubmit={handleFilterSubmit} />

      {showTable && (
        <div>
          <div className="mb-4">
            <h2 className="text-[#7367F0] font-semibold mt-4 text-xl">
              Exam Schedule
            </h2>
          </div>

          <DynamicTable
            columns={[
              { header: "Subject", accessor: "subject", type: "text" },
              {
                header: "Exam Date",
                accessor: "examDate",
                type: "date",
                render: (row) => formatDate(row.examDate),
              },
              {
                header: "Start Timing",
                accessor: "startTime",
                type: "time",
                render: (row) => formatTime(row.startTime),
              },
              {
                header: "End Timing",
                accessor: "endTime",
                type: "time",
                render: (row) => formatTime(row.endTime),
              },
            ]}
            data={examSubjects}
            handleInputChange={handleInputChange}
            handleDelete={handleDelete}
          />

          <div className="flex justify-end mt-6">
            <FormButton name="Save" onClick={handleSave} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExaminationScheduleComponent;
