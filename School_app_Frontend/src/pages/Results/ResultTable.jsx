import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ResultTable = ({ result, termName }) => {
  const [studentResult, setStudentResult] = useState(null);
  const [examTypes, setExamTypes] = useState([]);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (result && result.data && result.data.length > 0) {
      const studentData = result.data[0];
      setStudentResult(studentData);

      const exams =
        studentData?.subjects?.flatMap((subject) =>
          subject.exams.map((exam) => exam.examType)
        ) || [];

      const uniqueExamTypes = [...new Set(exams)];
      setExamTypes(uniqueExamTypes);
    } else {
      setStudentResult(null);
    }
  }, [result]);

  const generatePDF = async () => {
    const input = document.getElementById("result-table");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgWidth = 190;
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const pdfOutput = pdf.output("datauristring");
    setPdfDataUrl(pdfOutput);
    setShowPreview(true);
  };

  const handlePrint = () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = pdfDataUrl;
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  };

  if (!studentResult) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-[#283046] to-gray-900 shadow-lg rounded-lg">
        <p className="text-white">No results found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-[#283046] to-gray-900 shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">{termName}</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          onClick={generatePDF}
        >
          Download as PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <div id="result-table">
          <table className="min-w-full border bg-[#3D454E] rounded-md shadow-sm">
            <thead className="bg-[#203046] text-gray-200">
              <tr>
                <th className="border px-6 py-3">Subject</th>
                {examTypes.map((type) => (
                  <th key={type} className="border px-6 py-3">
                    {type} (
                    {studentResult.subjects[0]?.exams.find(
                      (exam) => exam.examType === type
                    )?.maxMarks || "-"}
                    )
                  </th>
                ))}
                <th className="border px-6 py-3">
                  Total (
                  {studentResult.subjects[0]?.subjectTotalPossibleMarks || "-"}{" "}
                  Marks)
                </th>
                <th className="border px-6 py-3">Grade</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {studentResult.subjects.map((subject, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-[#7367d0]" : "bg-[#203046]"
                  } text-center`}
                >
                  <td className="border px-4 py-2 font-medium">
                    {subject.subject}
                  </td>
                  {examTypes.map((type) => (
                    <td key={type} className="border px-4 py-2">
                      {subject.exams.find((exam) => exam.examType === type)
                        ?.marksObtained || 0}
                    </td>
                  ))}
                  <td className="border px-4 py-2">
                    {subject.subjectTotalMarksObtained || 0}
                  </td>
                  <td className="border px-4 py-2">{subject.subjectGrade}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#203046] font-semibold text-gray-200">
              <tr>
                <td className="border px-4 py-2">Total</td>
                <td
                  colSpan={examTypes.length}
                  className="border px-4 py-2"
                ></td>
                <td className="border px-4 py-2">
                  {studentResult.totalMarksObtained} /{" "}
                  {studentResult.totalPossibleMarks}
                </td>
                <td className="border px-4 py-2"></td>
              </tr>
              <tr className="bg-[#7367d0]">
                <td className="border px-4 py-2">Percentage</td>
                <td
                  colSpan={examTypes.length}
                  className="border px-4 py-2"
                ></td>
                <td className="border px-4 py-2">
                  {studentResult.percentage.toFixed(2)}%
                </td>
                <td className="border px-4 py-2">{studentResult.finalGrade}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Preview PDF</h2>
            <iframe
              src={pdfDataUrl}
              width="100%"
              height="400px"
              title="PDF Preview"
            ></iframe>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={handlePrint}
              >
                Print
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowPreview(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultTable;
