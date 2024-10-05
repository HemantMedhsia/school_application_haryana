import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import StudentAdmitCard from "./StudentAdmitCard";
import AdmitCardList from "./StudentAdmitCard";

const AdmitCardPrint = ({ students, commonInfo }) => {
  const admitCardRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: admitCardRef, // Using contentRef instead of content
    documentTitle: `Admit Card - ${commonInfo?.schoolName}`,
    onBeforeGetContent: () => console.log("Preparing content for print..."),
    onAfterPrint: () => console.log("Print completed"),
    onPrintError: (error) => console.error("Print error:", error),
  });

  console.log("Student Data:", student); // Log student data
  console.log("Exams Data:", exams); // Log exams data
  console.log("Admit Card Ref:", admitCardRef["current"]); // Log admit card ref

  return (
    <div>
      <div ref={admitCardRef}>
        {/* Admit Card Content */}
       <AdmitCardList students={students} commonInfo={commonInfo} />
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
