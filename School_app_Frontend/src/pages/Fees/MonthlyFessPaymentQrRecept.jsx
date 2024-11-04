import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import "react-toastify/dist/ReactToastify.css";

const MonthlyFessPaymentQrRecept = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [billData, setBillData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/all-class`)
      .then((response) => {
        if (response.data.success) {
          setClasses(response.data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
        toast.error("Failed to fetch classes");
        setLoading(false);
      });
  };

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const fetchStudentBill = () => {
    if (!selectedClass || !selectedDate) {
      toast.warning("Please select both class and date");
      return;
    }

    const payload = {
      date: selectedDate,
      class: selectedClass,
    };

    setLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-student-bill-month`,
        payload
      )
      .then((response) => {
        if (response.data.success) {
          setBillData(response.data.data);
          toast.success("Student bill data fetched successfully");
        } else {
          toast.error("Failed to fetch student bill data");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching student bill:", error);
        toast.error("Error fetching student bill");
        setLoading(false);
      });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredBillData = billData?.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Student Receipts",
    onAfterPrint: () => toast.success("Receipts printed successfully"),
  });

  return (
    <div className="max-w-full mx-auto p-8 bg-gradient-to-r from-[#283046] to-gray-900 text-white rounded-md shadow-2xl print:bg-white print:text-black print:p-4">
      <ToastContainer />
      <h2 className="text-3xl font-extrabold text-center mb-10 tracking-wide print:text-black">
        Monthly Fees Payment QR Receipt
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div>
          <label htmlFor="class" className="block text-lg font-semibold mb-2">
            Select Class
          </label>
          <select
            id="class"
            value={selectedClass}
            onChange={handleClassChange}
            className="w-full p-4 border border-indigo-300 rounded-lg bg-indigo-50 text-gray-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 print:text-black"
          >
            <option value="">--Select Class--</option>
            {classes.map((classItem) => (
              <option
                key={classItem._id}
                value={classItem._id}
                className="text-gray-700"
              >
                {classItem.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-lg font-semibold mb-2">
            Select Date
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full p-4 border border-indigo-300 rounded-lg bg-indigo-50 text-gray-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 print:text-black"
          />
        </div>

        <div>
          <label htmlFor="search" className="block text-lg font-semibold mb-2">
            Search by Name or Admission Number
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Enter student name or admission number"
            className="w-full p-4 border border-indigo-300 rounded-lg bg-indigo-50 text-gray-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 print:text-black"
          />
        </div>
      </div>

      <button
        onClick={fetchStudentBill}
        className="w-full py-4 bg-gradient-to-r from-green-400 to-green-700 text-gray-900 rounded-lg font-semibold text-lg tracking-wide shadow-xl hover:bg-gradient-to-l hover:from-green-400 hover:to-green-700 transition duration-1500 print:hidden"
      >
        Get Student Bill
      </button>

      <button
        onClick={handlePrint}
        className="mt-6 w-full py-4 bg-blue-500 text-white rounded-lg font-semibold text-lg tracking-wide shadow-xl hover:bg-blue-600 transition duration-150 print:hidden"
      >
        Print All Receipts
      </button>

      {loading && (
        <div className="flex justify-center items-center mt-10 print:hidden">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div ref={printRef} className="print:w-full print:max-w-full">
        {filteredBillData && (
          <div className="mt-12 print:mt-4 print:bg-yellow-50">
            <h3 className="text-4xl font-extrabold text-center mb-12 text-white font-serif print:text-black print:hidden">
              Student Bill Information
            </h3>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 print:grid-cols-2 print:gap-4">
              {filteredBillData.map((student, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-yellow-50 to-yellow-50 text-gray-800 p-10 border border-gray-500 rounded-3xl shadow-2xl print:shadow-none print:rounded-none print:border print:bg-yellow-100 print:text-black print:page-break-inside-avoid"
                  style={{ pageBreakInside: "avoid" }}
                >
                  <div className="flex items-center mb-10">
                    <img
                      src={student.schoolLogo}
                      alt="School Logo"
                      className="w-20 h-20 rounded-full mr-6 border-4 border-green-500 "
                      style={{ printColorAdjust: "exact" }}
                    />
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 font-serif print:text-black">
                        {student.schoolName}
                      </h4>
                      <p className="text-md text-gray-600 print:text-black">
                        {student.contactNumber}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-lg print:text-black">
                    <p>
                      <span className="font-semibold">Student Name:</span>{" "}
                      {student.studentName}
                    </p>
                    <p>
                      <span className="font-semibold">Father's Name:</span>{" "}
                      {student.fatherName}
                    </p>
                    <p>
                      <span className="font-semibold">Class Name:</span>{" "}
                      {student.className}
                    </p>
                    <p>
                      <span className="font-semibold">Admission Number:</span>{" "}
                      {student.admissionNumber}
                    </p>
                    <p>
                      <span className="font-semibold">Total Fees:</span> ₹
                      {student.totalFees}
                    </p>
                    <p>
                      <span className="font-semibold">Total Paid Amount:</span>{" "}
                      ₹{student.totalPaidAmount}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Total Discount Amount:
                      </span>{" "}
                      ₹{student.totalDiscountAmount}
                    </p>
                    <p>
                      <span className="font-semibold">Due Amount:</span> ₹
                      {student.dueAmount}
                    </p>
                  </div>
                  <div className="mt-8 flex justify-center">
                    <img
                      src={student.qrCode}
                      alt="QR Code"
                      className="w-48 h-48 shadow-2xl border-4 border-green-300 rounded-2xl print:w-32 print:h-32 print:border print:shadow-none"
                      style={{ printColorAdjust: "exact" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyFessPaymentQrRecept;
