import React from "react";

const ResultPrint = () => {
  // Hard-coded data (replace with your API response data)
  const data = {
    studentProfile: {
      name: "AMISH SRIVASTAVA",
      fatherName: "JYOTI PRAKASH SRIVASTAVA",
      motherName: "SMRITI SRIVASTAVA",
      admNo: "20170009",
      class: "XI",
      section: "(SCIENCE)",
      dob: "05-Jan-2008",
      rollNo: "10",
    },
    subjects: [
      {
        name: "English Core",
        term1: { unitTest: 8, internal: 57, halfYearly: 73 },
        term2: { unitTest: 9, internal: 55, annual: 71 },
        overallTotal: 318,
        grade: "A2",
      },
      {
        name: "Physics",
        term1: { unitTest: 7, internal: 17, halfYearly: 27 },
        term2: { unitTest: 3, internal: 39, annual: 50 },
        overallTotal: 143,
        grade: "C2",
      },
      {
        name: "Chemistry",
        term1: { unitTest: 3, internal: 26, halfYearly: 38 },
        term2: { unitTest: 3, internal: 34, annual: 46 },
        overallTotal: 148,
        grade: "C2",
      },
      {
        name: "Maths",
        term1: { unitTest: 5, internal: 27, halfYearly: 37 },
        term2: { unitTest: 8, internal: 35, annual: 48 },
        overallTotal: 160,
        grade: "C1",
      },
      {
        name: "Computer",
        term1: { unitTest: 10, internal: 35, halfYearly: 75 },
        term2: { unitTest: 9, internal: 50, annual: 69 },
        overallTotal: 248,
        grade: "B1",
      },
    ],
    gradeScale: [
      { range: "91-100", grade: "A1", points: 10 },
      { range: "81-90", grade: "A2", points: 9 },
      { range: "71-80", grade: "B1", points: 8 },
      { range: "61-70", grade: "B2", points: 7 },
      { range: "51-60", grade: "C1", points: 6 },
      { range: "41-50", grade: "C2", points: 5 },
      { range: "33-40", grade: "D", points: 4 },
    ],
  };

  return (
    <div className="p-8 text-sm bg-white text-black">
      {/* School Header */}
      <div className="text-center font-bold text-lg mb-6">
        <p className="text-xl">IMPERIAL PUBLIC SCHOOL, ASSI, VARANASI</p>
        <p className="text-sm font-medium">
          Affiliated to CBSE (10+2), New Delhi
        </p>
        <p className="text-sm">
          Website: www.imperialpublicschool.com | Email: ips.vns@yahoo.co.in
        </p>
        <p className="mt-4 font-semibold text-lg">
          REPORT CARD (SESSION: 2023-24)
        </p>
        <p className="mt-2">(Issued by School as per Directives of CBSE)</p>
      </div>

      {/* Student Profile */}
      <div className="grid grid-cols-2 gap-4 mt-6 border p-6 rounded-lg shadow">
        {Object.entries(data.studentProfile).map(([key, value]) => (
          <div key={key}>
            <strong>{key.replace(/([A-Z])/g, ' $1')}: </strong> {value}
          </div>
        ))}
      </div>

      {/* Scholastic Area */}
      <table className="table-auto w-full mt-6 border text-center text-sm shadow-md">
        <thead className="bg-gray-300 text-sm">
          <tr>
            <th rowSpan="2" className="border">Subject</th>
            <th colSpan="3" className="border">Term-I</th>
            <th colSpan="3" className="border">Term-II</th>
            <th rowSpan="2" className="border">Overall Marks</th>
            <th rowSpan="2" className="border">Grade</th>
          </tr>
          <tr>
            <th className="border">Unit Test</th>
            <th className="border">Internal</th>
            <th className="border">Half Yearly</th>
            <th className="border">Unit Test</th>
            <th className="border">Internal</th>
            <th className="border">Annual</th>
          </tr>
        </thead>
        <tbody>
          {data.subjects.map((subject, idx) => (
            <tr key={idx} className="border-t">
              <td className="border">{subject.name}</td>
              <td className="border">{subject.term1.unitTest}</td>
              <td className="border">{subject.term1.internal}</td>
              <td className="border">{subject.term1.halfYearly}</td>
              <td className="border">{subject.term2.unitTest}</td>
              <td className="border">{subject.term2.internal}</td>
              <td className="border">{subject.term2.annual}</td>
              <td className="border">{subject.overallTotal}</td>
              <td className="border">{subject.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Term-wise and Overall Summary */}
      <div className="mt-6 p-6 border rounded-lg shadow">
        <h3 className="font-bold text-lg text-center">Term-wise and Overall Summary</h3>
        <table className="table-auto w-full text-center mt-4">
          <thead className="bg-gray-300 text-sm">
            <tr>
              <th className="border">Subject</th>
              <th className="border">Term-I Total (50%)</th>
              <th className="border">Term-II Total (50%)</th>
              <th className="border">Grand Total (100%)</th>
              <th className="border">Grade</th>
            </tr>
          </thead>
          <tbody>
            {data.subjects.map((subject, idx) => (
              <tr key={idx} className="border-t">
                <td className="border">{subject.name}</td>
                <td className="border">{(subject.term1.unitTest + subject.term1.internal + subject.term1.halfYearly) / 2}</td>
                <td className="border">{(subject.term2.unitTest + subject.term2.internal + subject.term2.annual) / 2}</td>
                <td className="border">{subject.overallTotal}</td>
                <td className="border">{subject.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Overall Performance Summary */}
      <div className="mt-6 p-6 border rounded-lg shadow">
        <h3 className="font-bold text-lg text-center">Overall Performance</h3>
        <p className="text-center mt-4">
          Overall Percentage: 60%
        </p>
        <p className="text-center mt-2">
          Overall Grade: C1
        </p>
      </div>

      {/* Grade Scale */}
      <div className="mt-6 p-6 border rounded-lg shadow">
        <p className="font-bold">Grade Scale:</p>
        <table className="table-auto w-full mt-4 text-center text-sm">
          <thead className="bg-gray-300">
            <tr>
              <th className="border">Marks Range</th>
              <th className="border">Grade</th>
              <th className="border">Grade Point</th>
            </tr>
          </thead>
          <tbody>
            {data.gradeScale.map((scale, idx) => (
              <tr key={idx} className="border-t">
                <td className="border">{scale.range}</td>
                <td className="border">{scale.grade}</td>
                <td className="border">{scale.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultPrint;
