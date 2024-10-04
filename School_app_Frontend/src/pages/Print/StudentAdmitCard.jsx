import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import StudentAdmitCard from './StudentAdmitCard';  // Import your component

const AdmitCardPrint = ({ student, exams }) => {
    console.log(student, exams);
  const admitCardRef = useRef();
  

  const handlePrint = useReactToPrint({
    content: () => admitCardRef.current,
    documentTitle: `Admit Card for ${student.name}`,
    onBeforeGetContent: () => {
      console.log('Preparing to print...');
      return Promise.resolve();
    },
    onAfterPrint: () => {
      console.log('Print successful');
    },
    onError: (error) => {
      console.error('Error during print:', error);
    },
  });

  return (
    <div>
      {/* Render the Admit Card */}
      <div ref={admitCardRef} style={{ display: 'none' }}>
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
