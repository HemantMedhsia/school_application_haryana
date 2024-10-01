import React, { useEffect, useState } from "react";

const ResultTable = ({ result }) => {
  const [studentResult, setStudentResult] = useState(null);

  useEffect(() => {
    if (result && result.data) {
      setStudentResult(result.data[0]);
    }
  }, [result]);

  if (!studentResult) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Term I (100 Marks)</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          onClick={() => console.log("Implement download functionality")}
        >
          Download as PDF
        </button>
      </div>

      {/* Table Section */}
      <table className="min-w-full border border-gray-300 rounded-md shadow-sm">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="border border-gray-300 px-6 py-3">Subject</th>
            <th className="border border-gray-300 px-6 py-3">PA (20)</th>
            <th className="border border-gray-300 px-6 py-3">IA (20)</th>
            <th className="border border-gray-300 px-6 py-3">
              Half-Yearly (60)
            </th>
            <th className="border border-gray-300 px-6 py-3">Total (100)</th>
            <th className="border border-gray-300 px-6 py-3">Grade</th>
          </tr>
        </thead>
        <tbody>
          {studentResult.subjects.map((subject, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } text-center`}
            >
              <td className="border border-gray-300 px-4 py-2 font-medium">
                {subject.subject}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {subject.exams.find((exam) => exam.examType === "Unit Test")
                  ?.marksObtained || 0}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {subject.exams.find((exam) => exam.examType === "Internel ")
                  ?.marksObtained || 0}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {subject.exams.find((exam) => exam.examType === "Half Yearly")
                  ?.marksObtained || 0}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {subject.subjectTotalMarksObtained}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {subject.subjectGrade}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-200 font-semibold">
            <td className="border border-gray-300 px-4 py-2">Total</td>
            <td colSpan="3" className="border border-gray-300 px-4 py-2"></td>
            <td className="border border-gray-300 px-4 py-2">
              {studentResult.totalMarksObtained}
            </td>
            <td className="border border-gray-300 px-4 py-2"></td>
          </tr>
          <tr className="bg-gray-100 font-semibold">
            <td className="border border-gray-300 px-4 py-2">Percentage</td>
            <td colSpan="3" className="border border-gray-300 px-4 py-2"></td>
            <td className="border border-gray-300 px-4 py-2">
              {studentResult.percentage.toFixed(2)}%
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {studentResult.finalGrade}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ResultTable;
