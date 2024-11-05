import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const PaymentReceipt = () => {
  const location = useLocation();
  const paymentData = location.state?.paymentData;

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Payment Receipts",
  });

  return (
    <div className="p-4 min-h-screen">
      <button
        onClick={handlePrint}
        className="mb-4 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full shadow-lg hover:from-green-700 hover:to-green-600 transition duration-300 ease-in-out print:hidden"
      >
        Print Receipts
      </button>
      {paymentData ? (
        <div ref={componentRef} className="space-y-8">
          {/* First Receipt */}
          <div className="receipt bg-white border border-gray-300 rounded-2xl p-8 shadow-2xl">
            <ReceiptContent paymentData={paymentData} />
          </div>

          {/* Second Receipt */}
          <div className="receipt bg-white border border-gray-300 rounded-2xl p-8 shadow-2xl">
            <ReceiptContent paymentData={paymentData} />
          </div>
        </div>
      ) : (
        <p>No payment data available.</p>
      )}
    </div>
  );
};

const ReceiptContent = ({ paymentData }) => (
  <>
    <div className="text-center">
      <img
        src={paymentData.schoolDetails.logo}
        alt="School Logo"
        className="mx-auto h-24 w-24 object-contain"
      />
      <h2 className="text-3xl font-extrabold mt-4 text-gray-800">
        {paymentData.schoolDetails.name}
      </h2>
      <p className="text-gray-500 mt-1">
        Contact: {paymentData.schoolDetails.contact} | Email:{" "}
        {paymentData.schoolDetails.email}
      </p>
    </div>
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-center text-gold-600">
        Payment Receipt
      </h3>
      <div className="mt-6 text-gray-700 text-lg">
        <p className="mb-2">
          <span className="font-semibold">Receipt Number:</span>{" "}
          {paymentData.receiptNumber}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Father's Name:</span>{" "}
          {paymentData.fatherName}
        </p>
        <h4 className="font-semibold mt-4 text-xl">Students:</h4>
        <ul className="list-disc list-inside mt-2">
          {paymentData.studentNames.map((student, index) => (
            <li key={index}>
              {student.name} - Class {student.class}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <div className="flex justify-between">
            <span className="font-semibold">Total Due:</span>
            <span>₹ {paymentData.totalDue}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-semibold">Total Paid:</span>
            <span>₹ {paymentData.totalPaid}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-semibold">Today's Payment:</span>
            <span>₹ {paymentData.todayPaid}</span>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-8 text-center">
      <p className="text-gray-600 text-lg italic">
        "Education is the passport to the future, for tomorrow belongs to those
        who prepare for it today."
      </p>
      <p className="mt-4 text-gold-600 font-bold">
        Thank you for your payment!
      </p>
    </div>
  </>
);

export default PaymentReceipt;
