import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import StudentAdmitCard from "./StudentAdmitCard"; // Ensure this path is correct

const AdmitCardPrint = ({ student, exams }) => {
  const admitCardRef = useRef();

  // const handlePrint = useReactToPrint({
  //   contentRef: () => {
  //     if (!admitCardRef.current) {
  //       console.error("Admit card ref is not set."); // Log if ref is not set
  //       alert("No content to print!"); // Alert the user
  //       return null; // Return null if no content
  //     }
  //     console.log(admitCardRef.current);
  //     return admitCardRef.current;
  //   },
  //   documentTitle: `HemantAdmitCard`,
  //   onAfterPrint: () => alert("Admit Card printed successfully!"),
  // });

  // const handlePrint = useReactToPrint({contentRef:admitCardRef,    documentTitle: `HemantAdmitCard`,  });

  const handlePrint = useReactToPrint({
    contentRef: admitCardRef,
    documentTitle: `HemantAdmitCard`,
    onAfterPrint: () => alert("Admit Card printed successfully!"),
  });

  console.log("Student Data:", student); // Log student data
  console.log("Exams Data:", exams); // Log exams data
  console.log("Admit Card Ref:", admitCardRef["current"]); // Log admit card ref

  return (
    <div>
      {/* Render the Admit Card */}
      <div ref={admitCardRef}>
        {student && exams ? (
          <StudentAdmitCard student={student} exams={exams} />
        ) : (
          <p>No student or exam data available.</p>
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
