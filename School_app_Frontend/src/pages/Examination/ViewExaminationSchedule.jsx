import React, { useEffect, useState } from "react";
import DynamicTable from "../../common/Datatables/DynamicTable";
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar";
import axios from "axios";

const ViewExaminationSchedule = () => {
  const [examSubjects, setExamSubjects] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState("");
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
    try {
      const payload = {
        termId: filterValues.term,
        classId: filterValues.class,
        examTypeId: filterValues.examType,
        subjectGroupId: filterValues.subjectGroup,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-examschedule-byallids`,
        payload
      );

      if (response.status === 200 && response.data.success) {
        const examDetails = response.data.data.examDetails || [];

        if (examDetails.length === 0) {
          setNoDataMessage("Schedule is not available");
          setShowTable(false);
        } else {
          const subjects = examDetails.map((detail) => ({
            subject: detail.subject.name,
            examDate: new Date(detail.examDate).toISOString().split("T")[0], // Format the date
            startTime: detail.startTime,
            endTime: detail.endTime,
          }));

          setExamSubjects(subjects);
          setShowTable(true);
          setNoDataMessage(""); // Clear message if data is found
        }
      } else {
        setNoDataMessage("Schedule is not available");
        setShowTable(false);
      }
    } catch (error) {
      console.error("Error fetching exam schedule", error);
      setNoDataMessage("Schedule is not available");
      setShowTable(false);
    }

    setSelectedFilters(filterValues);
  };

  return (
    <div className="rounded-md">
      <div className="mb-4">
        <h2 className="text-[#7367F0] text-xl font-semibold">Filter Exams</h2>
      </div>

      <DynamicFilterBar filters={filterConfig} onSubmit={handleFilterSubmit} />

      {noDataMessage && <p className=" flex justify-center items-center text-red-500 mt-4">{noDataMessage}</p>}

      {showTable && (
        <div>
          <div className="mb-4">
            <h2 className="text-[#7367F0] font-semibold mt-4 text-xl">
              Exam Schedule
            </h2>
          </div>

          <DynamicTable columns={columns} data={examSubjects} />
        </div>
      )}
    </div>
  );
};

export default ViewExaminationSchedule;
