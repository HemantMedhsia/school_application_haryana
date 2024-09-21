import React, { useEffect, useState } from "react";
import DynamicTable from "../../common/Datatables/DynamicTable";
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar";
import FormButton from "../../components/Form/FormButton";
import axios from "axios";

const ViewExaminationSchedule = () => {
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

  const columns = [
    { header: "Subject", accessor: "subject", type: "text" },
    { header: "Exam Date", accessor: "examDate", type: "date" },
    { header: "Start Timing", accessor: "startTime", type: "time" },
    { header: "End Timing", accessor: "endTime", type: "time" },
  ];

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
        setSubjectGroups(
          classesResponse.data.data.flatMap((cls) =>
            cls.subjectGroups.map((group) => ({
              ...group,
              classId: cls._id,
              subjects: group.subjects || [],
            }))
          )
        );
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleFilterSubmit = async (filterValues) => {
    const selectedSubjectGroup = subjectGroups.find(
      (group) => group._id === filterValues.subjectGroup
    );
    try {
      const payload = {
        termId: filterValues.term,
        classId: filterValues.class,
        examTypeId: filterValues.examType,
        subjectGroupId: filterValues.subjectGroup,
      };
      console.log("Payload", payload);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-examschedule-byallids`,
        payload
      );

      if (response.status === 201) {
        console.log("Exam schedule saved successfully");
      } 
    } catch (error) {
      console.error("Error saving exam schedule", error);
    }

    if (selectedSubjectGroup) {
      const subjects = selectedSubjectGroup.subjects.map((subject) => ({
        subject: subject._id,
        subjectName: subject.name,
        examDate: "1970-01-01",
        startTime: "09:00",
        endTime: "10:00",
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
      };

      console.log("Payload", payload);

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
    <div className="rounded-md">
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
            columns={columns}
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

export default ViewExaminationSchedule;
