import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaMoneyCheckAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const StudentsFeesPage = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [siblingFeeData, setSiblingFeeData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch all students from the API
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-all-students`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.data && response.data.statusCode === 200) {
        setStudents(response.data.data);
      } else {
        toast.error("Failed to fetch students");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Error fetching students");
    }
  };

  // Handle fee submission
  const handleFeeSubmission = (studentId) => {
    // Navigate to fee submission page with student ID
    navigate(`/school/fee-submission/${studentId}`);
  };

  // Handle pay all siblings
  const handlePayAllSiblings = async (studentId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-student-sibling-fee/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.data && response.data.statusCode === 200) {
        setSiblingFeeData(response.data.data);
        setIsModalOpen(true);
      } else {
        toast.error("Failed to fetch sibling fee details");
      }
    } catch (error) {
      console.error("Error fetching sibling fee details:", error);
      toast.error("Error fetching sibling fee details");
    }
  };

  // Handle payment for siblings
  const handlePayment = async () => {
    const payload = {
      siblingId: "672084c8428260ce5adad08c",
      feeDetails: [
        {
          feeHeader: "Tuition Fee",
          discountAmount: 50,
          amountPaying: 8982,
        },
      ],
      paymentDate: "2024-11-04",
      paymentMode: "Cash",
      remarks: "Partial payment for siblings.",
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/siblings-fees`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.data && response.data.statusCode === 200) {
        toast.success("Payment successful");
        closeModal();
      } else {
        toast.error("Failed to make payment");
      }
    } catch (error) {
      console.error("Error making payment:", error);
      toast.error("Error making payment");
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSiblingFeeData(null);
  };

  // Prepare chart data
  const chartData = siblingFeeData && {
    labels: siblingFeeData.studentFeesDetails.map((feeDetail) => feeDetail.studentName),
    datasets: [
      {
        label: "Total Fees",
        data: siblingFeeData.studentFeesDetails.map((feeDetail) => feeDetail.totalFees),
        backgroundColor: "#3b82f6",
      },
      {
        label: "Due Amount",
        data: siblingFeeData.studentFeesDetails.map((feeDetail) => feeDetail.dueAmount),
        backgroundColor: "#f87171",
      },
    ],
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-200">
      <h2 className="text-3xl font-extrabold mb-8 text-indigo-400 flex items-center">
        <FaMoneyCheckAlt className="mr-3" />
        Students List
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl">
          <thead>
            <tr>
              <th className="py-4 px-6 text-left font-semibold text-gray-400">
                Student Name
              </th>
              <th className="py-4 px-6 text-left font-semibold text-gray-400">
                Admission No
              </th>
              <th className="py-4 px-6 text-left font-semibold text-gray-400">
                Class
              </th>
              <th className="py-4 px-6 text-left font-semibold text-gray-400">
                Section
              </th>
              <th className="py-4 px-6 text-left font-semibold text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student._id}
                className={`${
                  index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                } hover:bg-gray-600 transition-colors duration-200`}
              >
                <td className="py-4 px-6 border-b border-gray-700">
                  {`${student.firstName} ${student.lastName}`}
                </td>
                <td className="py-4 px-6 border-b border-gray-700">
                  {student.admissionNo}
                </td>
                <td className="py-4 px-6 border-b border-gray-700">
                  {`Class ${student.currentClass.name}`}
                </td>
                <td className="py-4 px-6 border-b border-gray-700">
                  {student.currentSection.name}
                </td>
                <td className="py-4 px-6 border-b border-gray-700">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleFeeSubmission(student._id)}
                      className="flex items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-5 py-2 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
                    >
                      Submit Fee
                    </button>
                    {student.siblingGroupId && (
                      <button
                        onClick={() => handlePayAllSiblings(student._id)}
                        className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
                      >
                        Pay All Siblings
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Sibling Fee Details"
        className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-5xl mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="overflow-y-auto max-h-[80vh]">
          <h2 className="text-3xl font-bold text-indigo-400 mb-4 text-center">
            Sibling Fee Details
          </h2>
          {siblingFeeData ? (
            <div>
              <table className="min-w-full bg-gray-700 rounded-lg mb-8">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-400">
                      Student Name
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-400">
                      Class
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-400">
                      Father Name
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-400">
                      Mobile Number
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-400">
                      Total Fees
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-400">
                      Due Amount
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-400">
                      Discount
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-400">
                      Advance Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {siblingFeeData.studentFeesDetails.map((feeDetail) => (
                    <tr key={feeDetail.studentId} className="hover:bg-gray-600">
                      <td className="py-3 px-4 border-b border-gray-600">
                        {feeDetail.studentName}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-600">
                        {`Class ${feeDetail.class}`}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-600">
                        {feeDetail.fatherName}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-600">
                        {feeDetail.mobileNumber}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-600">
                        {feeDetail.totalFees}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-600">
                        {feeDetail.dueAmount}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-600">
                        {feeDetail.discount}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-600">
                        {feeDetail.advanceAmount || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-indigo-400 mb-4">Combined Summary</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                    <p className="text-gray-400 mb-2">Total Fees: {siblingFeeData.combinedSummary.totalFees}</p>
                    <p className="text-gray-400 mb-2">Total Paid: {siblingFeeData.combinedSummary.totalPaid}</p>
                    <p className="text-gray-400 mb-2">Due Fees Till Today: {siblingFeeData.combinedSummary.dueFeesTillToday}</p>
                    <p className="text-gray-400 mb-2">Total Discount: {siblingFeeData.combinedSummary.totalDiscount}</p>
                    <p className="text-gray-400 mb-2">Fee After Discount: {siblingFeeData.combinedSummary.feeAfterDiscount}</p>
                    <p className="text-gray-400">Total Due: {siblingFeeData.combinedSummary.totalDue}</p>
                  </div>
                  <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                    <Bar data={chartData} options={{ maintainAspectRatio: false }} height={200} />
                  </div>
                </div>
              </div>
              <button
                onClick={handlePayment}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
              >
                Pay Now
              </button>
            </div>
          ) : (
            <p className="text-gray-400">No sibling fee details available.</p>
          )}
          <button
            onClick={closeModal}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
          >
            Close
          </button>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default StudentsFeesPage;
