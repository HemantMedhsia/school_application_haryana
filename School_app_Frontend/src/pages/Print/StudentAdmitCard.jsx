import React, { useState, useEffect, useRef, forwardRef } from "react";
import DynamicTable from "../../common/Datatables/DynamicTable";
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar";
import Modal from "react-modal";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import logo from '../../assets/logo.png';

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

  const printRef = useRef(null);

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
    if (printResponse) {
      setReadyToPrint(true);
    }
  }, [printResponse]);

  const handlePrintAdmitCards2 = useReactToPrint({
    content: () => printRef.current, // Correctly assign the ref to content
    documentTitle: `Admit Card - 1`,
    onBeforeGetContent: () => console.log("Preparing content for print..."),
    onAfterPrint: () => console.log("Print completed"),
    onBeforePrint: () =>
      new Promise((resolve) => {
        console.log("Preparing for print ");
        resolve();
      }),
    onPrintError: (error) => console.error("Print error:", error),
  });

  const handlePrintAdmitCards = async () => {
    await axios
      .post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/print-admit-card/${classId}/${examTypeId}/${termId}`,
        {
          studentIds: selectedStudents,
        }
      )
      .then((response) => {
        setPrintResponse(response.data.data);
        handlePrintAdmitCards2();
      })
      .catch((error) => {
        console.error(
          "Error printing admit cards",
          error.response?.data || error.message
        );
      });
  };

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
            <h2 className="text-[#7367F0] text-xl font-semibold">
              Exam Schedule
            </h2>
          </div>

          <DynamicTable
            data={examSubjects}
            columns={columns}
            title="Exam Schedule"
          />
          <div className="mt-4">
            <button
              onClick={fetchStudentInfo}
              className="bg-[#7367F0] text-white px-6 py-2 rounded-md"
            >
              Print Admit Cards
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Select Students Modal"
      >
        <h2 className="text-xl font-semibold mb-4">Select Students</h2>
        <div>
          {students.length === 0 ? (
            <p>No students found.</p>
          ) : (
            <div className="mb-4">
              {students.map((student) => (
                <div key={student._id} className="mb-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value={student._id}
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => handleStudentCheckboxChange(student._id)}
                      className="mr-2"
                    />
                    {student.name} ({student.rollNumber})
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <button
            onClick={() => {
              handlePrintAdmitCards();
            }}
            className="bg-[#7367F0] text-white px-6 py-2 rounded-md"
          >
            Print Selected Students Admit Cards
          </button>
        </div>
      </Modal>

                  {/* Print Admit Card Area */}
                  {printResponse && printResponse.students && printResponse.students.length > 0 && (
                <div ref={printRef}>
                    <AdmitCardList
                        students={printResponse.students}
                        commonInfo={printResponse.commonInfo}
                    />
                </div>
            )}

    </div>
  );
};

const AdmitCardList = ({ students, commonInfo }) => {
  return (
    <>
      {students.map((student) => (
        <StudentAdmitCard
          key={student._id}
          student={student}
          commonInfo={commonInfo}
        />
      ))}
    </>
  );
};

const StudentAdmitCard = ({ student, commonInfo }) => {
  return (
    <div className="p-4 mb-4 border border-gray-300 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <img src={logo} alt="School Logo" className="h-16" />
        <div className="text-center">
          <h2 className="text-xl font-semibold">Vardhan International School</h2>
          <p>{commonInfo?.examType || ""} Admit Card</p>
          <p>{commonInfo?.termName || ""}</p>
        </div>
        <div>
          <p className="font-semibold">
            Roll Number: {student.rollNumber || "N/A"}
          </p>
          <p>Class: {student.className || "N/A"}</p>
        </div>
      </div>
      <div className="border-t border-gray-300 pt-4">
        <h3 className="text-lg font-semibold">Student Information</h3>
        <p>Name: {student.name}</p>
        <p>Father's Name: {student.fatherName}</p>
        <p>Date of Birth: {student.dateOfBirth}</p>
        <p>Address: {student.address}</p>
      </div>
      <div className="border-t border-gray-300 pt-4">
        <h3 className="text-lg font-semibold">Exam Schedule</h3>
        <ul>
          {student.exams.map((exam) => (
            <li key={exam.subjectId} className="mt-2">
              <span className="font-semibold">{exam.subjectName}</span> -{" "}
              {exam.examDate} ({exam.startTime} to {exam.endTime})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewExaminationSchedule;
