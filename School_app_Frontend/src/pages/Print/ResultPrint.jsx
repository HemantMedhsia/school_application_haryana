import React from "react";
import logo from "../../assets/logo.png";
import { dateFnsLocalizer } from "react-big-calendar";

const ResultPrint = ({data2}) => {
  // Hard-coded data (replace with your API response data)
  const {studentProfile, subjects} = data2;

  

  console.log(subjects);
  const data = {
    commonData: {
      schoolName: "Vardhan International School",
      address:
        "Plot No. 30, Nibiya Lathiya, Bypass, Varanasi, Uttar Pradesh 221011",
      affiliation: "Affiliated to CBSE(10+2), New Delhi",
      website: "http://www.imperialpublicschool.com",
      email: "ips.vns@yahoo.co.in",
      logo: "/path/to/your/logo.png",
      secondLogo: "/path/to/your/second_logo.png",
      session: "2023-24",
    },
    studentProfile: studentProfile,
    subjects: [
      {
        name: "English Core",
        term1: { unitTest: 8, internal: 57, halfYearly: 73, total: 138 },
        term2: { unitTest: 9, internal: 55, annual: 71, total: 135 },
        overallTotal: 318,
        grade: "A2",
      },
      {
        name: "Physics",
        term1: { unitTest: 7, internal: 17, halfYearly: 27, total: 51 },
        term2: { unitTest: 3, internal: 39, annual: 50, total: 92 },
        overallTotal: 143,
        grade: "C2",
      },
      {
        name: "Chemistry",
        term1: { unitTest: 3, internal: 26, halfYearly: 38, total: 67 },
        term2: { unitTest: 3, internal: 34, annual: 46, total: 83 },
        overallTotal: 148,
        grade: "C2",
      },
      {
        name: "Maths",
        term1: { unitTest: 5, internal: 27, halfYearly: 37, total: 69 },
        term2: { unitTest: 8, internal: 35, annual: 48, total: 91 },
        overallTotal: 160,
        grade: "C1",
      },
      {
        name: "Computer",
        term1: { unitTest: 10, internal: 35, halfYearly: 75, total: 120 },
        term2: { unitTest: 9, internal: 50, annual: 69, total: 128 },
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
    <div className="relative p-8 text-sm bg-indigo-100 text-black overflow-auto">
      <div className="absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 z-10">
        {/* Watermark container with absolute positioning */}
        <img
          src={logo} // Update this path to your watermark logo's actual location
          alt="Watermark"
          className="w-[1000px] h-auto" // Adjust size as needed
        />
      </div>

      {/* School Header */}
      <div className="flex justify-between items-center mb-4">
        {/* Left Logo */}
        <img
          src={logo} // Update this path to your school logo's actual location
          alt="School Logo"
          className="w-52 h-52" // Adjust width and height as needed
        />

        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-black leading-tight">
            {data.commonData.schoolName}
          </h1>
          <p className="text-lg mt-1  text-black">{data.commonData.address}</p>
          <p className="text-lg  text-black">{data.commonData.affiliation}</p>
          <p className="text-md mt-2 text-gray-700">
            Website:{" "}
            <a
              href="http://www.imperialpublicschool.com"
              className="underline text-blue-600"
            >
              {data.commonData.website}
            </a>{" "}
            | Email:{" "}
            <a
              href="mailto:ips.vns@yahoo.co.in"
              className="underline text-blue-600"
            >
              {data.commonData.email}
            </a>
          </p>
        </div>

        {/* Right Logo */}
        <img
          src={logo} // Update this path to your school logo's actual location
          alt="School Logo"
          className="w-52 h-52" // Adjust width and height as needed
        />
      </div>

      <div className="text-center">
        <h2 className=" font-extrabold text-2xl text-red-500 leading-tight">
          REPORT CARD (SESSION : 2023-24)
        </h2>
      </div>

      {/* Student Profile */}
      <div className="border rounded-lg p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-2 mt-4">
              {Object.entries(data.studentProfile).map(
                ([key, value]) =>
                  key !== "profilePicture" && ( // Exclude profile picture key
                    <div key={key} className="border-b border-black pb-2">
                      <strong className="text-gray-900">
                        {key.replace(/([A-Z])/g, " $1")}:{" "}
                      </strong>
                      <span className="text-gray-600 text-md font-semibold">
                        {value}
                      </span>
                    </div>
                  )
              )}
            </div>
          </div>
          <img
            src={
              "https://www.bing.com/th?id=OIP.2qc6aY9hwuxfyxFTFf9GdAAAAA&w=150&h=178&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2"
            } // Adjust the path based on your data structure
            alt="Profile Picture"
            className="w-40 h-44 rounded-md border-2 border-indigo-300 ml-4"
          />
        </div>
      </div>

      {/* Scholastic Area */}
      <table className="table-auto w-full mt-6 border-black border-2  text-center text-sm shadow-md">
        <thead className="bg-yellow-200 text-sm ">
          <tr>
            <th rowSpan="2" className="border border-black ">
              Subject
            </th>
            <th colSpan="4" className="border border-black">
              Term-I
            </th>
            <th colSpan="4" className="border border-black">
              Term-II
            </th>
            <th rowSpan="2" className="border border-black">
              Overall Marks
            </th>
          </tr>
          <tr>
            <th className="border border-black ">Unit Test</th>
            <th className="border border-black">Internal</th>
            <th className="border border-black">Half Yearly</th>
            <th className="border border-black">Total</th>
            <th className="border border-black">Unit Test</th>
            <th className="border border-black">Internal</th>
            <th className="border border-black">Annual</th>
            <th className="border border-black">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.subjects.map((subject, idx) => (
            <tr key={idx} className="border-t">
              <td className="border border-black py-1">{subject.name}</td>
              <td className="border border-black">{subject.term1.unitTest}</td>
              <td className="border border-black">{subject.term1.internal}</td>
              <td className="border border-black">
                {subject.term1.halfYearly}
              </td>
              <td className="border border-black">{subject.term1.total}</td>
              <td className="border border-black">{subject.term2.unitTest}</td>
              <td className="border border-black">{subject.term2.internal}</td>
              <td className="border border-black">{subject.term2.annual}</td>
              <td className="border border-black">{subject.term2.total}</td>
              <td className="border border-black">{subject.overallTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Term-wise and Overall Summary */}
      <div className="mt-2 border rounded-lg shadow">
        <h3 className="font-bold text-xl text-center">
          Term-wise and Overall Summary
        </h3>
        <table className="table-auto w-full text-center border-black border-2 mt-4">
          <thead className="bg-yellow-200 text-sm">
            <tr>
              <th className="border-2 border-black">Subject</th>
              <th className="border-2 border-black">Term-I Total (50%)</th>
              <th className="border-2 border-black">Term-II Total (50%)</th>
              <th className="border-2 border-black">Grand Total (100%)</th>
              <th className="border-2 border-black">Grade</th>
            </tr>
          </thead>
          <tbody>
            {data.subjects.map((subject, idx) => (
              <tr key={idx} className="border-t">
                <td className="border border-black py-1">{subject.name}</td>
                <td className="border border-black">
                  {(subject.term1.unitTest +
                    subject.term1.internal +
                    subject.term1.halfYearly) /
                    2}
                </td>
                <td className="border border-black">
                  {(subject.term2.unitTest +
                    subject.term2.internal +
                    subject.term2.annual) /
                    2}
                </td>
                <td className="border border-black">{subject.overallTotal}</td>
                <td className="border border-black font-semibold text-green-700">{subject.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 p-6 border-2 border-black">
        <div className="flex justify-between mt-8">
          {/* Class Teacher Signature */}
          <div className="flex flex-col items-center">
            <div className="w-48 border-b-2 border-gray-500 mb-2"></div>
            <p className="text-sm font-semibold">Class Teacher's Signature</p>
          </div>

          {/* Teacher Signature */}
          <div className="flex flex-col items-center">
            <div className="w-48 border-b-2 border-gray-500 mb-2"></div>
            <p className="text-sm font-semibold">Teacher's Signature</p>
          </div>

          {/* Principal Signature */}
          <div className="flex flex-col items-center">
            <div className="w-48 border-b-2 border-gray-500 mb-2"></div>
            <p className="text-sm font-semibold">Principal's Signature</p>
          </div>
        </div>
        <div className="flex justify-between border border-black px-2 mt-8">
          {/* Class Teacher Signature */}
          <div className="flex w-1/3 items-center justify-start border-black">
            <p className="text-sm font-semibold">Attendence: </p>
          </div>

          <div className="border-r-2 border-black "></div>

          {/* Teacher Signature */}
          <div className="flex w-1/3 ml-2 justify-start items-center">
            <p className="text-sm font-semibold">Rank: </p>
          </div>

          <div className="border-r-2 border-black "></div>

          {/* Principal Signature */}
          <div className="flex w-1/3 items-center justify-end">
            <p className="text-sm font-semibold">Result: Passed / Promoted / E.R.</p>
          </div>
        </div>

        {/* Date */}
        <div className="flex justify-start mt-8">
          <div className="flex flex-col items-center">
            <p className="text-sm font-semibold">
              {" "}
              Date Of Issue: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
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
