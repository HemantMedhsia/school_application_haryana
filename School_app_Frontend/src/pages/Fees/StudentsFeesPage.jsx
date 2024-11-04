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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [siblingFeeData, setSiblingFeeData] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    amountPaying: "",
    paymentMode: "",
    discount: "",
    remarks: "",
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (siblingFeeData) {
      const discountAmount = paymentDetails.discount
        ? parseFloat(paymentDetails.discount)
        : 0;
      setTotalAmount(siblingFeeData.combinedSummary.totalDue - discountAmount);
    }
  }, [paymentDetails.discount, siblingFeeData]);

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
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/get-student-sibling-fee/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Log the entire response to check the structure
      console.log("API Response:", response.data.data);

      if (response.data && response.data.statusCode === 200) {
        // Check if siblingGroupId exists and set siblingFeeData accordingly
        if (
          response.data.data &&
          response.data.data.combinedSummary.siblingGroupId
        ) {
          setSiblingFeeData(response.data.data);
        } else {
          console.error("siblingGroupId is missing in the response data");
          toast.error("Sibling Group ID is missing in the response data");
        }
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
    console.log("siblingFeeData:", siblingFeeData);
    if (!siblingFeeData || !siblingFeeData.combinedSummary.siblingGroupId) {
      console.error("Sibling Group ID is undefined");
      toast.error("Sibling Group ID is undefined");
      return;
    }

    const discountAmount = paymentDetails.discount
      ? parseFloat(paymentDetails.discount)
      : 0;
    const amountPaying = totalAmount;

    const payload = {
      siblingId: siblingFeeData.combinedSummary.siblingGroupId,
      feeDetails: [{
        feeHeader:"Tuition Fee",
        discountAmount: discountAmount,
        amountPaying: amountPaying,
      }],
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMode: paymentDetails.paymentMode,
      remarks: paymentDetails.remarks,
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
        closePaymentModal();
        closeModal();
        navigate(`/school/payment-recept-siblings`, {state: {paymentData: response.data.data}});
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

  // Close payment modal
  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentDetails({
      amountPaying: "",
      paymentMode: "",
      discount: "",
      remarks: "",
    });
  };

  // Open payment modal
  const openPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  // Prepare chart data
  const chartData = siblingFeeData && {
    labels: siblingFeeData.studentFeesDetails.map(
      (feeDetail) => feeDetail.studentName
    ),
    datasets: [
      {
        label: "Total Fees",
        data: siblingFeeData.studentFeesDetails.map(
          (feeDetail) => feeDetail.totalFees
        ),
        backgroundColor: "#3b82f6",
      },
      {
        label: "Due Amount",
        data: siblingFeeData.studentFeesDetails.map(
          (feeDetail) => feeDetail.dueAmount
        ),
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
                <h3 className="text-2xl font-bold text-indigo-400 mb-4">
                  Combined Summary
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                    <p className="text-gray-400 mb-2">
                      Total Fees: {siblingFeeData.combinedSummary.totalFees}
                    </p>
                    <p className="text-gray-400 mb-2">
                      Total Paid: {siblingFeeData.combinedSummary.totalPaid}
                    </p>
                    <p className="text-gray-400 mb-2">
                      Due Fees Till Today:{" "}
                      {siblingFeeData.combinedSummary.dueFeesTillToday}
                    </p>
                    <p className="text-gray-400 mb-2">
                      Total Discount:{" "}
                      {siblingFeeData.combinedSummary.totalDiscount}
                    </p>
                    <p className="text-gray-400 mb-2">
                      Fee After Discount:{" "}
                      {siblingFeeData.combinedSummary.feeAfterDiscount}
                    </p>
                    <p className="text-gray-400">
                      Total Due: {siblingFeeData.combinedSummary.totalDue}
                    </p>
                  </div>
                  <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                    <Bar
                      data={chartData}
                      options={{ maintainAspectRatio: false }}
                      height={200}
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={openPaymentModal}
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

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onRequestClose={closePaymentModal}
        contentLabel="Payment Details"
        className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold text-indigo-400 mb-4 text-center">
          Payment Details
        </h2>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Discount</label>
          <input
            type="number"
            value={paymentDetails.discount}
            onChange={(e) =>
              setPaymentDetails({ ...paymentDetails, discount: e.target.value })
            }
            className="w-full p-2 rounded-md bg-gray-700 text-gray-200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Total Amount</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)} // Make totalAmount editable
            className="w-full p-2 rounded-md bg-gray-700 text-gray-200"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Payment Mode</label>
          <select
            value={paymentDetails.paymentMode}
            onChange={(e) =>
              setPaymentDetails({
                ...paymentDetails,
                paymentMode: e.target.value,
              })
            }
            className="w-full p-2 rounded-md bg-gray-700 text-gray-200"
          >
            <option value="">Select Payment Mode</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Remarks</label>
          <input
            type="text"
            value={paymentDetails.remarks}
            onChange={(e) =>
              setPaymentDetails({ ...paymentDetails, remarks: e.target.value })
            }
            className="w-full p-2 rounded-md bg-gray-700 text-gray-200"
          />
        </div>
        <button
          onClick={handlePayment}
          className="mt-6 bg-green-600 hover:bg-green-700 mr-4 text-white px-5 py-2 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
        >
          Confirm Payment
        </button>
        <button
          onClick={closePaymentModal}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
        >
          Cancel
        </button>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default StudentsFeesPage;