import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import StudentAdmitCard from './StudentAdmitCard';  // Import your component

const AdmitCardPrint = ({ student, exams }) => {
  const admitCardRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => admitCardRef.current,
    documentTitle: `Hemant Admit Card`,
  });

  return (
    <div>
      {/* Render the Admit Card */}
      <div ref={admitCardRef}>
        <StudentAdmitCard student={student} exams={exams} />
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
