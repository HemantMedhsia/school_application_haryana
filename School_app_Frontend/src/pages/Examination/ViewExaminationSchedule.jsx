import React, { useState, useEffect, useRef } from "react";
import DynamicTable from "../../common/Datatables/DynamicTable";
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar";
import Modal from "react-modal";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
// import AdmitCardList from "../Print/StudentAdmitCard";
import logo from "../../assets/logo.png";
import AdmitCardList from "../Print/StudentAdmitCard";
import { toast } from "react-toastify";

Modal.setAppElement("#root"); // Set your app root element for accessibility

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
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setSubjectGroups([]);
    }
  };

  const filterConfig = [
    {
      name: "term",
      label: "Select Term",
      placeholder: "Select Term",
      type: "select",
      required: true,
      options: terms.map((term) => ({
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
      options: classes.map((classItem) => ({
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
      options: examTypes.map((examType) => ({
        label: examType?.name || "Unknown",
        value: examType?._id || "",
      })),
    },
  ];

  const handlePrint = useReactToPrint({ contentRef: printRef });

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
  };

  const fetchStudentInfo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/getallstudentsinfo/${classId}`
      );
      setStudents(response.data.data || []);
      setSelectedStudents([]); // Clear previous selection
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  const handleDelete = () => {
    toast.warning("Delete functionality is not available in this view");
    console.log("Delete functionality is not available in this view");
  }

  const handleStudentCheckboxChange = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handlePrintAdmitCards = async () => {
    // Debugging line
    console.log("Request Payload:", {
      studentIds: selectedStudents,
      classId,
      examTypeId,
      termId,
    });

    if (selectedStudents.length > 0) {
      try {
        const response = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/print-admit-card/${classId}/${examTypeId}/${termId}`,
          { studentIds: selectedStudents }
        );

        console.log("Print Response:", response.data); // Debugging line
        if (response.data && response.data.success) {
          setPrintResponse(response.data.data);
          setTimeout(() => {
            handlePrint();
          }, 2000);
          setIsModalOpen(false);
        } else {
          console.error(
            "Printing failed:",
            response.data.message || "Unknown error"
          );
          alert("No data available for printing");
        }
      } catch (error) {
        console.error(
          "Error printing admit cards",
          error.response?.data || error.message
        );
        alert("Error printing admit cards");
      }
    } else {
      alert("Please select at least one student to print admit cards.");
    }
  };

  return (
    <div className="rounded-md">
      <div className="mb-4">
        <h2 className="text-[#7367F0] text-xl font-semibold">Filter Exams</h2>
      </div>

      <DynamicFilterBar filters={filterConfig} onSubmit={handleFilterSubmit} />

      {noDataMessage && (
        <p className="flex justify-center items-center text-2xl text-red-500 mt-4">
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
            handleDelete={handleDelete}
          </div>

          {/* Open Modal Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={fetchStudentInfo}
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
            className="relative w-full max-w-2xl mx-auto bg-gray-900 rounded-2xl shadow-2xl p-8"
            overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
          >
            <h2 className="text-3xl mb-6 text-white font-extrabold">
              Select Students for Admit Card Printing
            </h2>
            <div className="flex flex-col space-y-4">
              {students.map((student) => (
                <div key={student.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleStudentCheckboxChange(student.id)}
                    className="mr-4 h-6 w-6 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
                  />
                  <label className="text-lg text-gray-200">
                    {student.name}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-8 space-x-4">
              <button
                onClick={handlePrintAdmitCards}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-full hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                Print Selected
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gradient-to-r from-red-600 to-pink-700 text-white py-3 px-6 rounded-full hover:from-red-700 hover:to-pink-800 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </Modal>

          {/* Component for printing the admit cards */}
          <div ref={printRef} className="no-print">
            <AdmitCardList
              students={printResponse?.students}
              commonInfo={printResponse?.commonInfo}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewExaminationSchedule;
