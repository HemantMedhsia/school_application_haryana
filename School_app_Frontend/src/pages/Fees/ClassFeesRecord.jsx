import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClassFeesRecord = () => {
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [feesData, setFeesData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false); // New state to track if data has been fetched

  // Fetch class list from the API on component mount
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/all-class`)
      .then((response) => {
        if (response.data.success) {
          setClassList(response.data.data);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching class data:", error);
        toast.error("Error fetching class data.");
      });
  }, []);

  // Fetch fees data based on selected class and date
  const fetchFeesData = () => {
    if (selectedClass && selectedDate) {
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/api/student-due-fee-per-class`,
          {
            date: selectedDate,
            class: selectedClass,
          }
        )
        .then((response) => {
          if (response.data.success) {
            setFeesData(response.data.data);
            setDataFetched(true); // Update state to indicate data has been fetched
            if (
              response.data.data.length === 0 ||
              response.data.data === null
            ) {
              toast.info("No data found for the selected class and date.");
            }
          } else if (response.data.statusCode === 404) {
            toast.info("No data found for the selected class and date.");
          } else {
            toast.error(response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error fetching fees data:", error);
          toast.error("Error fetching fees data");
        });
    } else {
      toast.warn("Please select both a class and a date.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-900 min-h-screen">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-8 text-center text-white">
        Class Fees Record
      </h1>

      <div className="bg-gray-800 shadow rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="classSelect"
              className="block mb-2 text-lg font-medium text-gray-200"
            >
              Select Class
            </label>
            <select
              id="classSelect"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="block w-full border border-gray-600 bg-gray-700 text-gray-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select Class --</option>
              {classList.map((classItem) => (
                <option key={classItem._id} value={classItem._id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="dateSelect"
              className="block mb-2 text-lg font-medium text-gray-200"
            >
              Select Date
            </label>
            <input
              type="date"
              id="dateSelect"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="block w-full border border-gray-600 bg-gray-700 text-gray-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={fetchFeesData}
            className="inline-block bg-blue-600 text-white text-lg font-semibold py-3 px-8 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Fetch Fees Data
          </button>
        </div>
      </div>

      {dataFetched && (
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Fees Data</h2>
          {feesData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                      Student Name
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                      Father Name
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                      Admission Number
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                      Contact
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                      Current Year Fees
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                      Total Fees
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                      Total Paid Amount
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                      Total Discount Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {feesData.map((student, index) => (
                    <tr
                      key={student.admissionNumber}
                      className={
                        index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"
                      }
                    >
                      <td className="py-4 px-6">{student.studentName}</td>
                      <td className="py-4 px-6">{student.fatherName}</td>
                      <td className="py-4 px-6">{student.admissionNumber}</td>
                      <td className="py-4 px-6">{student.contact}</td>
                      <td className="py-4 px-6">{student.currentYearFees}</td>
                      <td className="py-4 px-6">{student.totalFees}</td>
                      <td className="py-4 px-6">{student.totalPaidAmount}</td>
                      <td className="py-4 px-6">
                        {student.totalDiscountAmount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-300 text-lg text-center">
              No data available for the selected class and date.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassFeesRecord;
