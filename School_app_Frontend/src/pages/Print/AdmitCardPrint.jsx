import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import AdmitCardList from "./StudentAdmitCard";

const AdmitCardPrint = ({ students, commonInfo }) => {
  const admitCardRef = useRef(null);
  const [readyToPrint, setReadyToPrint] = useState(false);

  useEffect(() => {
    // Only allow printing if the component is rendered and ref is assigned
    if (students && commonInfo && admitCardRef.current) {
      setReadyToPrint(true);
    }
  }, [students, commonInfo, admitCardRef]);

  const handlePrint = useReactToPrint({
    content: () => admitCardRef.current, // Correctly assign the ref to content
    documentTitle: `Admit Card - ${commonInfo?.schoolName}`,
    onBeforeGetContent: () => console.log("Preparing content for print..."),
    onAfterPrint: () => console.log("Print completed"),
    onPrintError: (error) => console.error("Print error:", error),
  });

  // Debugging Logs
  useEffect(() => {
    console.log("Student Data:", students); 
    console.log("Common Info:", commonInfo);
    console.log("Admit Card Ref:", admitCardRef.current); 
  }, [students, commonInfo]);

  // Ensure students and commonInfo are loaded before showing the button
  if (!students || !commonInfo) {
    return <p>Loading admit card data...</p>;
  }

  return (
    <div>
      {/* Ensure the content is visible and ready to be printed */}
      <div ref={admitCardRef}>
        {/* Admit Card Content */}
        <AdmitCardList students={students} commonInfo={commonInfo} />
      </div>

      {/* Print Button, enabled only when component is ready */}
      {readyToPrint && (
        <button
          onClick={handlePrint}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-all mt-4"
        >
          Print Admit Card
        </button>
      )}
    </div>
  );
};

export default AdmitCardPrint;
