import React, { useState, useEffect, useRef } from "react";
import DynamicTable from "../../common/Datatables/DynamicTable";
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar";
import Modal from "react-modal";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import AdmitCardList from "../Print/StudentAdmitCard";

const ViewExaminationSchedule = () => {
  const [examSubjects, setExamSubjects] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [terms, setTerms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjectGroups, setSubjectGroups] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [classId, setClassId] = useState(null);
  const [examTypeId, setExamTypeId] = useState(null);
  const [termId, setTermId] = useState(null);
  const [printResponse, setPrintResponse] = useState(null);
  const [readyToPrint, setReadyToPrint] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    term: null,
    class: null,
    subjectGroup: null,
    examType: null,
  });
  const [students, setStudents] = useState([]); // State to store students data
  const [selectedStudents, setSelectedStudents] = useState([]); // State for selected students
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const printRef = useRef();

  const columns = [
    { header: "Subject", accessor: "subject", type: "text" },
    { header: "Exam Date", accessor: "examDate", type: "date" },
    { header: "Start Timing", accessor: "startTime", type: "time" },
    { header: "End Timing", accessor: "endTime", type: "time" },
  ];

  const handleClassChange = (selectedClassId) => {
    setClassId(selectedClassId);
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

        // Fetch students data from API
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleFilterSubmit = async (filterValues) => {
    setClassId(filterValues.class);
    setExamTypeId(filterValues.examType);
    setTermId(filterValues.term);
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
            examDate: new Date(detail.examDate).toISOString().split("T")[0],
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

  useEffect(() => {
    // Only allow printing if the component is rendered and ref is assigned
    if (true) {
      setReadyToPrint(true);
    }
  }, [printResponse]);

  const handlePrintAdmitCards2 = useReactToPrint({
    contentRef: () => printRef.current, // Correctly assign the ref to content
    documentTitle: `Admit Card - 1`,
    onBeforeGetContent: () => console.log("Preparing content for print..."),
    onAfterPrint: () => console.log("Print completed"),
    onPrintError: (error) => console.error("Print error:", error),
  });

  const handlePrintAdmitCards = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/print-admit-card/${classId}/${examTypeId}/${termId}`,
        { studentIds: selectedStudents }
      );
  
      console.log("Print Response:", response.data); // Log the response
  
      if (response.data && response.data.success) {
        setPrintResponse(response.data.data); // Ensure this structure is correct
        handlePrintAdmitCards2(); // Call printing function
      } else {
        console.error("Printing failed:", response.data.message || "Unknown error");
        alert("No data available for printing");
      }
    } catch (error) {
      console.error("Error printing admit cards", error.response?.data || error.message);
      alert("Error printing admit cards");
    }
  };
  

  useEffect(() => {
    if (printResponse && printResponse.students.length > 0) {
      setTimeout(() => {
        handlePrintAdmitCards2();
      }, 2000);
    }
  }, [printResponse]);

  // Function to handle checkbox change for selecting students
  const handleStudentCheckboxChange = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const fetchStudentInfo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/getallstudentsinfo/${classId}`
      );
      setStudents(response.data.data || []);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  return (
    <div className="rounded-md">
      <div className="mb-4">
        <h2 className="text-[#7367F0] text-xl font-semibold">Filter Exams</h2>
      </div>

      <DynamicFilterBar filters={filterConfig} onSubmit={handleFilterSubmit} />

      {noDataMessage && (
        <p className="flex justify-center items-center text-red-500 mt-4">
          {noDataMessage}
        </p>
      )}

      {showTable && (
        <div>
          <div className="mb-4">
            <h2 className="text-[#7367F0] font-semibold mt-4 text-xl">
              Exam Schedule
            </h2>
          </div>

          {/* Printable Section */}
          <div>
            <DynamicTable columns={columns} data={examSubjects} />
          </div>

          {printResponse && printResponse.students.length > 0 && (
            <div ref={printRef}>
              <AdmitCardList
                students={printResponse.students}
                commonInfo={printResponse.commonInfo}
              />
            </div>
          )}
          {/* Open Modal Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => fetchStudentInfo()}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all"
            >
              Select Students for Admit Cards
            </button>
          </div>

          {/* Modal for selecting students */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Select Students Modal"
            className="relative w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <h2 className="text-xl font-semibold">Select Students</h2>
            <div className="mb-4 max-h-[50vh] overflow-y-auto">
              {students.map((student) => (
                <div key={student.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleStudentCheckboxChange(student.id)}
                  />
                  <span>{student.name}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              {readyToPrint && (
                <button
                  onClick={handlePrintAdmitCards}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-all"
                >
                  Print Admit Cards
                </button>
              )}
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default ViewExaminationSchedule;
