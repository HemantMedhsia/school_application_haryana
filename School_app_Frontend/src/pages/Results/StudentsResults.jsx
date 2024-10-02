import React, { useEffect, useState } from "react";
import MultiRowValuesDatatable from "../../common/Datatables/MultiRowValuesDatatable";
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar";
import { getAPI } from "../../utility/api/apiCall";
import axios from "axios";

const StudentsResults = () => {
  const [tabledata, setTableData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [term, setTerm] = useState([]);
  const [termId, setTermId] = useState("");
  const [section, setSection] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedExamData, setSelectedExamData] = useState(null);
  const [selectedViewAllexamData, setSelectedViewAllexamData] = useState(null);
  const [isViewAllPopupOpen, setIsViewAllPopupOpen] = useState(false);

  const fetchData = async () => {
    try {
      await Promise.all([
        getAPI("getAllClasses", {}, setClasses),
        getAPI("getAllExamCategories", {}, setTerm),
        // getAPI("getAllSections", {}, setSection),
      ]);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const studentTableData = async (termId, classId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-student-result-info`,
        {
          termId,
          classId,
        }
      );
      const transformedData = response.data.data.map((student) => ({
        name: student.studentName,
        studentId: student._id,
        rollNumber: student.rollno,
        examTypes: student.exams.map((exam) => exam.name.trim()),
        examTypeIds: student.exams.map((exam) => exam._id),
        percentage: student.exams.map((exam) => exam.percentage),
        overallPercentage: student.overallPercentage,
        grade: student.grade,
      }));
      setTableData(transformedData);
      console.log("Table Data", transformedData);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
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
    {
      name: "class",
      label: "Select Class",
      placeholder: "Select Class",
      required: true,
      type: "select",
      options: classes.map((classItem) => ({
        label: classItem.name,
        value: classItem._id,
      })),
    },
  ];

  const actions = {
    onViewExam: async (student, examType) => {
      console.log(`Viewing exam ${examType} for ${student.studentId}`);
      await axios
        .post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/get-student-result-byexamtype`,
          {
            studentId: student.studentId,
            examType,
          }
        )
        .then((response) => {
          setSelectedExamData(response.data.data[0]);
          setIsPopupOpen(true);
        })
        .catch((error) => {
          console.error("Error fetching exam results", error);
        });
    },
    onViewAll: async (student) => {
      console.log(
        `Viewing all results for ${student.studentId} with term ${termId}`
      );
      await axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/api/get-student-result-byterm`,
          {
            studentId: student.studentId,
            term: termId,
          }
        )
        .then((response) => {
          setSelectedViewAllexamData(response.data.data[0]);
          console.log("Selected Exam Data", response.data.data);
          setIsViewAllPopupOpen(true);
        })
        .catch((error) => {
          console.error("Error fetching all results", error);
        });
    },
  };

  const handleFilterSubmit = (filterValues) => {
    const { term: termId, class: classId } = filterValues;
    setTermId(termId);
    studentTableData(termId, classId);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedExamData(null);
  };

  return (
    <div>
      <DynamicFilterBar filters={filters} onSubmit={handleFilterSubmit} />
      <div className="mt-4">
        <MultiRowValuesDatatable data={tabledata} actions={actions} />
      </div>

      {/* Custom Popup for displaying selected exam data */}
      {isPopupOpen && selectedExamData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          {/* Main popup card container */}
          <div className="bg-gray-900 border-[#7367F0] border-2 rounded-xl shadow-2xl p-8 max-w-3xl w-full relative transform transition-transform scale-100 max-h-[90%]  overflow-auto">
            {/* Header section with title and close button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-[#65FA9E]">
                Exam Details
              </h2>
              <button
                onClick={closePopup}
                className="text-[#65FA9E] hover:text-[#7367F0] transition-colors duration-300 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Total Marks and Percentage - Represented as cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Total Marks Card */}
              <div className="bg-[#1F2A40] rounded-lg p-4 shadow-md text-center border border-[#7367F0]">
                <p className="text-lg font-semibold text-[#65FA9E]">
                  Total Marks
                </p>
                <p className="text-4xl font-extrabold text-[#65FA9E]">
                  {selectedExamData.totalMarksObtained}
                </p>
                <p className="text-sm text-gray-400">
                  out of {selectedExamData.totalPossibleMarks}
                </p>
              </div>

              {/* Percentage Card with Dynamic Colors */}
              <div
                className={`rounded-lg p-4 bg-gray-700 shadow-md text-center border border-[#7367F0] ${
                  selectedExamData.percentage >= 80
                    ? "text-green-500" // Green for 80% and above
                    : selectedExamData.percentage >= 50
                    ? "text-yellow-500" // Yellow for 50% to 79%
                    : "text-red-500" // Red for below 50%
                }`}
              >
                <p className="text-lg font-semibold text-[#65FA9E]">
                  Percentage
                </p>
                <p className="text-4xl font-extrabold">
                  {selectedExamData.percentage}%
                </p>
                <p className="text-sm text-gray-400">
                  Overall Grade: {selectedExamData.grade}
                </p>
              </div>
            </div>

            {/* Progress Bar showing performance */}
            <div className="mb-6">
              <p className="text-lg font-semibold text-[#65FA9E] mb-2">
                Performance Overview
              </p>

              {/* Progress bar displaying percentage */}
              <div className="w-full bg-gray-800 rounded-full h-4 mb-2">
                <div
                  className="bg-[#7367F0] h-4 rounded-full"
                  style={{
                    width: `${selectedExamData.percentage}%`, // Width set based on percentage
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-400">
                {selectedExamData.percentage}% achieved
              </p>
            </div>

            {/* Subject-wise Performance with Scroll */}
            <div className="mb-6 max-h-64 overflow-y-auto">
              <h3 className="text-lg font-semibold text-[#65FA9E] mb-4">
                Subject-wise Performance
              </h3>
              <div className="space-y-4">
                {selectedExamData.subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#1F2A40] p-4 rounded-lg shadow-md border border-gray-700"
                  >
                    {/* Subject and Marks Information */}
                    <div>
                      <p className="text-base font-semibold text-[#65FA9E]">
                        {subject.subject}
                      </p>
                      <p className="text-sm text-gray-400">
                        Marks: {subject.totalMarksObtained} | Grade:{" "}
                        {subject.grade}
                      </p>
                      {/* Comments and Suggestions */}
                      <p
                        className={`text-sm mt-1 ${
                          subject.grade === "A+" || subject.grade === "A"
                            ? "text-green-400"
                            : subject.grade === "B"
                            ? "text-blue-400"
                            : subject.grade === "C"
                            ? "text-yellow-400"
                            : subject.grade === "D"
                            ? "text-orange-400"
                            : "text-red-500"
                        }`}
                      >
                        {subject.grade === "A+"
                          ? "Outstanding performance! You have mastered the material."
                          : subject.grade === "A"
                          ? "Very good! You have a strong understanding of the material."
                          : subject.grade === "B"
                          ? "Good job! You have a solid grasp of the concepts."
                          : subject.grade === "C"
                          ? "Fair effort. You have a basic understanding, but there's room for improvement."
                          : subject.grade === "D"
                          ? "Needs improvement. Focus on strengthening your understanding."
                          : "Poor performance. You should revisit the material thoroughly."}
                      </p>
                    </div>

                    {/* Grade display with conditional color coding based on marks */}
                    <div
                      className={`text-xl font-extrabold ${
                        subject.grade === "A+" || subject.grade === "A"
                          ? "text-green-400"
                          : subject.grade === "B"
                          ? "text-blue-400"
                          : subject.grade === "C"
                          ? "text-yellow-400"
                          : subject.grade === "D"
                          ? "text-orange-400"
                          : "text-red-500"
                      }`}
                    >
                      {subject.grade}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Suggestions */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#65FA9E] mb-2">
                Overall Suggestions
              </h3>
              <p
                className={`text-base ${
                  selectedExamData.percentage >= 50
                    ? "text-green-400"
                    : selectedExamData.percentage >= 35
                    ? "text-yellow-400"
                    : "text-red-500"
                }`}
              >
                {selectedExamData.percentage >= 90
                  ? "Outstanding performance! You have mastered the material. Keep challenging yourself to stay ahead."
                  : selectedExamData.percentage >= 75
                  ? "Very good! You have a strong understanding of the material. Aim for excellence by addressing any minor gaps."
                  : selectedExamData.percentage >= 60
                  ? "Good job! You have a solid grasp of the concepts. Focus on refining your knowledge and skills."
                  : selectedExamData.percentage >= 50
                  ? "Fair effort. You have a basic understanding, but there's significant room for improvement. Review the material and practice more."
                  : selectedExamData.percentage >= 35
                  ? "Needs improvement. Identify the areas where you struggle and seek help to strengthen your understanding."
                  : "Poor performance. It's crucial to revisit the material thoroughly and seek additional support to grasp the concepts."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Popup for displaying all exam data */}
      {isViewAllPopupOpen && selectedViewAllexamData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-900 border-[#7367F0] border-2 rounded-xl shadow-2xl p-8 max-w-4xl w-full relative transform transition-transform scale-100 max-h-[90%] overflow-auto">
            {/* Popup Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-[#65FA9E]">
                Overall Results
              </h2>
              <button
                onClick={() => setIsViewAllPopupOpen(false)}
                className="text-[#65FA9E] hover:text-[#7367F0] transition-colors duration-300 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Total Marks and Percentage */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-lg font-semibold text-[#65FA9E]">
                  Total Marks
                </p>
                <p className="text-4xl font-extrabold text-[#65FA9E]">
                  {selectedViewAllexamData.totalMarksObtained}
                </p>
                <p className="text-sm text-gray-400">
                  out of {selectedViewAllexamData.totalPossibleMarks}
                </p>
              </div>

              <div
                className={`p-4 rounded-lg text-center ${
                  selectedViewAllexamData.percentage >= 80
                    ? "text-green-500"
                    : selectedViewAllexamData.percentage >= 50
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                <p className="text-lg font-semibold text-[#65FA9E]">
                  Percentage
                </p>
                <p className="text-4xl font-extrabold">
                  {selectedViewAllexamData.percentage}%
                </p>
                <p className="text-sm text-gray-400">
                  Final Grade: {selectedViewAllexamData.finalGrade}
                </p>
              </div>
            </div>

            {/* Subject-wise Performance */}
            <div className="max-h-64 overflow-y-auto mb-6">
              <h4 className="text-lg font-semibold text-[#65FA9E] mb-4">
                Subject-wise Performance
              </h4>
              <div className="space-y-4">
                {selectedViewAllexamData.subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-4 rounded-lg shadow-md"
                  >
                    {/* Subject Header */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-base font-semibold text-[#65FA9E]">
                          {subject.subject}
                        </p>
                        <p className="text-sm text-gray-400">
                          Total Marks: {subject.subjectTotalMarksObtained} /{" "}
                          {subject.subjectTotalPossibleMarks} | Grade:{" "}
                          {subject.subjectGrade}
                        </p>
                      </div>

                      {/* Grade display with conditional color coding */}
                      <div
                        className={`text-xl font-extrabold ${
                          subject.subjectTotalMarksObtained >= 50
                            ? "text-green-400"
                            : subject.subjectTotalMarksObtained >= 35
                            ? "text-yellow-400"
                            : "text-red-500"
                        }`}
                      >
                        {subject.subjectGrade}
                      </div>
                    </div>

                    {/* Exam Type Breakdown */}
                    <div className="space-y-2">
                      {subject.exams.map((exam, examIndex) => (
                        <div
                          key={examIndex}
                          className="flex justify-between items-center text-sm text-gray-400"
                        >
                          <p>{exam.examType}</p>
                          <p>
                            Marks: {exam.marksObtained} / {exam.maxMarks}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Comments based on performance */}
                    <p
                      className={`text-sm mt-4 ${
                        subject.subjectTotalMarksObtained >= 50
                          ? "text-green-400"
                          : subject.subjectTotalMarksObtained >= 35
                          ? "text-yellow-400"
                          : "text-red-500"
                      }`}
                    >
                      {subject.subjectTotalMarksObtained >= 90
                        ? "Outstanding performance! You have mastered the material."
                        : subject.subjectTotalMarksObtained >= 75
                        ? "Very good! You have a strong understanding of the material."
                        : subject.subjectTotalMarksObtained >= 60
                        ? "Good job! You have a solid grasp of the concepts."
                        : subject.subjectTotalMarksObtained >= 50
                        ? "Fair effort. You have a basic understanding, but there's room for improvement."
                        : subject.subjectTotalMarksObtained >= 35
                        ? "Needs improvement. Focus on strengthening your understanding."
                        : "Poor performance. You should revisit the material thoroughly."}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Notes and Comments */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#65FA9E] mb-2">
                Final Notes and Comments
              </h3>
              <p
                className={`text-base ${
                  selectedViewAllexamData.percentage >= 80
                    ? "text-green-400"
                    : selectedViewAllexamData.percentage >= 50
                    ? "text-yellow-400"
                    : "text-red-500"
                }`}
              >
                {selectedViewAllexamData.percentage >= 90
                  ? "Excellent work overall! Keep up the great performance. Continue pushing yourself to achieve even greater success."
                  : selectedViewAllexamData.percentage >= 75
                  ? "Great job! You have a solid understanding. With a little more effort, you can reach even higher levels of achievement."
                  : selectedViewAllexamData.percentage >= 60
                  ? "Good work! Focus on areas of improvement to sharpen your skills and knowledge further."
                  : selectedViewAllexamData.percentage >= 50
                  ? "You’ve shown some understanding, but there’s a lot of room for improvement. Concentrate on addressing weaker areas."
                  : selectedViewAllexamData.percentage >= 35
                  ? "Your performance needs improvement. Consider reviewing the material and seeking help in areas where you're struggling."
                  : "Significant improvement is needed. Please revisit the material and work closely with your teachers to improve."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsResults;
