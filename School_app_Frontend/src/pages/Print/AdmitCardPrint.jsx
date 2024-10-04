import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

// Mock implementation of StudentAdmitCard for testing
const StudentAdmitCard = ({
  student = {
    name: "John Doe",
    rollNo: "12345",
    className: "10th Grade",
    photo:
      "https://imresizer.com/_next/image?url=%2Fimages%2Fsample-photo-1.jpg&w=1920&q=75", // replace with actual photo URL
  },
  exams = [
    {
      subject: "Mathematics",
      examDate: "2024-10-15",
      startTime: "09:00 AM",
      endTime: "12:00 PM",
    },
    {
      subject: "Science",
      examDate: "2024-10-17",
      startTime: "09:00 AM",
      endTime: "12:00 PM",
    },
    {
      subject: "English",
      examDate: "2024-10-19",
      startTime: "09:00 AM",
      endTime: "12:00 PM",
    },
    {
      subject: "History",
      examDate: "2024-10-21",
      startTime: "09:00 AM",
      endTime: "12:00 PM",
    },
  ],
}) => (
  <div className="p-4 border border-gray-300">
    <h2 className="text-xl font-bold mb-2">Admit Card</h2>
    <img
      src={student.photo}
      alt={`${student.name}'s photo`}
      className="w-24 h-24 mb-2"
    />
    <p>
      <strong>Name:</strong> {student.name}
    </p>
    <p>
      <strong>Roll No:</strong> {student.rollNo}
    </p>
    <p>
      <strong>Class:</strong> {student.className}
    </p>
    <h3 className="mt-4">Exam Schedule</h3>
    <ul>
      {exams.map((exam, index) => (
        <li key={index}>
          {exam.subject} - {exam.examDate} ({exam.startTime} to {exam.endTime})
        </li>
      ))}
    </ul>
  </div>
);

const AdmitCardPrint = ({ student, exams }) => {
    console.log(student, exams);
  const admitCardRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => admitCardRef.current,
    documentTitle: `Admit Card for ${student.name}`,
    onBeforeGetContent: () => {
      console.log("Preparing to print...");
      return Promise.resolve();
    },
    onAfterPrint: () => {
      console.log("Print successful");
    },
    onError: (error) => {
      console.error("Error during print:", error);
    },
  });

  return (
    <div>
      {/* Render the Admit Card */}
      <div ref={admitCardRef}>
        {student && exams.length > 0 ? (
          <StudentAdmitCard student={student} exams={exams} />
        ) : (
          <p>No data available to print.</p>
        )}
      </div>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-all mt-4"
      >
        Print Admit Card
      </button>
    </div>
  );
};

export default AdmitCardPrint;
