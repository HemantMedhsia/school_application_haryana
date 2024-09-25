import React, { useEffect, useState } from "react";
import DynamicTable from "../../common/Datatables/DynamicTable"; // Import your dynamic table
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar"; // Import the dynamic filter bar
import FormButton from "../Form/FormButton";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const ExaminationScheduleComponent = () => {
  const [examSubjects, setExamSubjects] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [terms, setTerms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjectGroups, setSubjectGroups] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
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
    const time = new Date(`2024-01-01T${value}Z`); // Use any valid date for time parsing
    return isNaN(time)
      ? ""
      : time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Fetching terms, classes, and exam types
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
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleClassChange = (selectedClassId) => {
    const selectedClass = classes.find((cls) => cls._id === selectedClassId);

    if (selectedClass) {
      setSubjectGroups(selectedClass.subjectGroups || []);
    } else {
      setSubjectGroups([]); // Clear subject groups if no class is selected
    }
  };

  const filterConfig = [
    {
      name: "term",
      label: "Select Term",
      placeholder: "Select Term",
      type: "select",
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
      type: "select",
      options: (classes || []).map((classItem) => ({
        label: classItem?.name || "Unknown",
        value: classItem?._id || "",
      })),
      onChange: handleClassChange,
    },
    {
      name: "subjectGroup",
      label: "Select Subject Group",
      placeholder: "Select Subject Group",
      type: "select",
      required: true,
      options: subjectGroups.map((group) => ({
        label: group?.name || "Unknown",
        value: group?._id || "",
      })),
    },
    {
      name: "examType",
      label: "Select Exam Type",
      placeholder: "Select Exam Type",
      type: "select",
      required: true,
      options: (examTypes || []).map((examType) => ({
        label: examType?.name || "Unknown",
        value: examType?._id || "",
      })),
    },
  ];

  const handleFilterSubmit = (filterValues) => {
    const selectedSubjectGroup = subjectGroups.find(
      (group) => group._id === filterValues.subjectGroup
    );

    if (selectedSubjectGroup) {
      const subjects = selectedSubjectGroup.subjects.map((subject) => ({
        subject: subject._id, // Keep the ID
        subjectName: subject.name, // Add subject name
        examDate: "2024-01-01",
        startTime: null,
        endTime: null,
      }));

      setExamSubjects(subjects);
      setShowTable(true); // Show table when subjects are available
    } else {
      setExamSubjects([]);
      setShowTable(false); // Hide table if no subjects are found
    }

    setSelectedFilters(filterValues); // Update selected filters
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
        examDetails: examSubjects.map((subject) => ({
          subject: subject.subject,
          examDate: new Date(subject.examDate),
          startTime: subject.startTime ? subject.startTime : "00:00",
          endTime: subject.endTime ? subject.endTime : "00:00",
        })),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/create-examschedule`,
        payload
      );

      if (response.status === 201) {
        toast.success("Exam schedule saved successfully!");
      }
    } catch (error) {
      console.error("Error saving exam schedule", error);
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Error saving exam schedule";
          toast.error(errorMessage);
    }
  };

  return (
    <div className="rounded-md">
      <div className="mb-4">
        <h2 className="text-[#7367F0] text-xl font-semibold">Filter Exams</h2>
      </div>

      <DynamicFilterBar filters={filterConfig} onSubmit={handleFilterSubmit} />

      {showTable && examSubjects.length > 0 && (
        <div>
          <div className="mb-4">
            <h2 className="text-[#7367F0] font-semibold mt-4 text-xl">
              Exam Schedule
            </h2>
          </div>

          <DynamicTable
            columns={[
              { header: "Subject", accessor: "subjectName", type: "text" },
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
      <ToastContainer />
    </div>
  );
};

export default ExaminationScheduleComponent;
