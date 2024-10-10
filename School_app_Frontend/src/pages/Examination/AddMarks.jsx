import React, { useEffect, useState } from "react";
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar";
import DynamicTable from "../../common/Datatables/DynamicTable";
import FormButton from "../../components/Form/FormButton";
import { getAPI } from "../../utility/api/apiCall";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddMarks = () => {
  const [showTable, setShowTable] = useState(false);
  const [studentsData, setStudentsData] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [terms, setTerms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [subjectGroups, setSubjectGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [maxMarks, setMaxMarks] = useState();
  const [selectedTermId, setSelectedTermId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedExamTypeId, setSelectedExamTypeId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const handleClassChange = (selectedClassId) => {
    const selectedClass = classes.find((cls) => cls._id === selectedClassId);
    setSelectedClassId(selectedClass._id);

    if (selectedClass) {
      setSubjectGroups(selectedClass.subjectGroups || []);
    } else {
      setSubjectGroups([]);
    }
  };

  const handleSubjectGroupChange = (selectedSubjectGroupId) => {
    const selectedSubjectGroup = subjectGroups.find(
      (group) => group._id === selectedSubjectGroupId
    );

    if (selectedSubjectGroup) {
      setSubjects(selectedSubjectGroup.subjects || []);
    } else {
      setSubjects([]);
    }
  };

  const handleSubjectChange = (selectedSubjectId) => {
    console.log("Selected Subject:", selectedSubjectId);
    setSelectedSubjectId(selectedSubjectId);
  };

  const filterConfig = [
    {
      name: "term",
      label: "Select Term",
      placeholder: "Select Term",
      required: true,
      type: "select",
      options: (terms || []).map((term) => ({
        label: term?.name || "Unknown",
        value: term?._id || "",
      })),
    },
    {
      name: "examType",
      label: "Select Exam Type",
      placeholder: "Select Exam Type",
      required: true,
      type: "select",
      options: (examTypes || []).map((exam) => ({
        label: exam?.name || "Unknown",
        value: exam?._id || "",
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
      required: true,
      type: "select",
      options: (subjectGroups || []).map((group) => ({
        label: group?.name || "Unknown",
        value: group?._id || "",
      })),
      onChange: handleSubjectGroupChange,
    },
    {
      name: "subject",
      label: "Select Subject",
      placeholder: "Select Subject",
      required: true,
      type: "select",
      options: (subjects || []).map((sub) => ({
        label: sub?.name || "Unknown",
        value: sub?._id || "",
      })),
      onChange: handleSubjectChange,
    },
  ];

  const fetchStudentData = async (classId, examType) => {
    if (!classId || !examType) return;
    try {
      const [studentsResponse, maxMarksResponse] = await Promise.all([
        axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/getallstudentsinfo/${classId}`
        ),
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/max-marks/${examType}`
        ),
      ]);

      setStudentsData(studentsResponse.data.data);
      setMaxMarks(maxMarksResponse.data.data.maxMark);
    } catch (error) {
      console.error("Error fetching student data or max marks", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAPI("getAllExamTypes", {}, setExamTypes),
          getAPI("getAllClasses", {}, setClasses),
          getAPI("getAllExamCategories", {}, setTerms),
        ]);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handleFilterSubmit = async (filterValues) => {
    const { class: classId, examType, subject, term } = filterValues;
    setSelectedTermId(term);
    setSelectedExamTypeId(examType);

    const subjectsData = subjects.find((sub) => sub._id === subject);
    await fetchStudentData(classId, examType);
  };

  useEffect(() => {
    if (studentsData.length > 0) {
      const refinedStudents = studentsData.map((student) => ({
        name: student.name,
        id: student.id,
        rollNo: student.rollNumber,
        subject: subjects.find((sub) => sub._id === selectedSubjectId)?.name,
        maxMarks,
        obtainedMarks: "",
      }));

      setFilteredStudents(refinedStudents);
      setShowTable(true);
    }
  }, [studentsData, maxMarks, subjects, selectedSubjectId]);

  const handleInputChange = (e, rowIndex, columnAccessor) => {
    if (columnAccessor === "maxMarks") return;

    const updatedStudents = [...filteredStudents];
    const obtainedMarks = e.target.value;

    if (Number(obtainedMarks) > Number(updatedStudents[rowIndex].maxMarks)) {
      toast.error(
        `Obtained marks cannot be greater than max marks (${updatedStudents[rowIndex].maxMarks}).`
      );
      return;
    }

    updatedStudents[rowIndex][columnAccessor] = obtainedMarks;
    setFilteredStudents(updatedStudents);
  };

  const handleSave = () => {
    const termId = selectedTermId;
    const classId = selectedClassId;
    const examTypeId = selectedExamTypeId;
    const subjectId = selectedSubjectId;

    const studentMarksArray = filteredStudents.map(
      (student) => (
        console.log("Student:", student),
        {
          studentId: student.id,
          marksObtained: student.obtainedMarks || 0,
        }
      )
    );

    const payload = {
      termId,
      classId,
      examTypeId,
      subjectId,
      studentMarksArray,
    };

    console.log("Payload:", payload);

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/addmultiple-mark-data`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      .then((response) => {
        console.log("Marks saved successfully:", response.data);
        toast.success("Marks saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving marks:", error);
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred while saving marks.";
        toast.error(errorMessage);
      });
  };

  return (
    <div>
      <ToastContainer />
      <div className="mb-4">
        <h2 className="text-[#7367F0] text-xl font-semibold">Add Marks</h2>
      </div>
      <DynamicFilterBar filters={filterConfig} onSubmit={handleFilterSubmit} />

      {showTable && (
        <div>
          <div className="mb-4">
            <h2 className="text-[#7367F0] font-semibold mt-4 text-xl">
              Student Marks Table
            </h2>
          </div>

          <DynamicTable
            columns={[
              { header: "Student Name", accessor: "name", type: "text" },
              { header: "Roll No", accessor: "rollNo", type: "text" },
              { header: "Subject", accessor: "subject", type: "text" },
              { header: "Max Marks", accessor: "maxMarks", type: "number" },
              {
                header: "Obtained Marks",
                accessor: "obtainedMarks",
                type: "number",
                inputType: "number",
              },
            ]}
            data={filteredStudents}
            handleInputChange={handleInputChange}
          />

          <div className="flex justify-end mt-6">
            <FormButton name="Save" onClick={handleSave} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMarks;
