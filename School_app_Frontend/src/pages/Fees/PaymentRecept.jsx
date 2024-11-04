import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentRecept = () => {
  const location = useLocation();
  const paymentData = location.state.paymentData; // Accessing the data passed in navigate's state

  console.log(paymentData);

  return (
    <div>
      <h1>Payment Receipt</h1>
      {paymentData ? (
        <div>
          <h2>Payment Details</h2>
          <p><strong>Sibling ID:</strong> {paymentData.siblingId}</p>
          <p><strong>Fee Header:</strong> {paymentData.feeDetails[0].feeHeader}</p>
          <p><strong>Discount Amount:</strong> {paymentData.feeDetails[0].discountAmount}</p>
          <p><strong>Amount Paying:</strong> {paymentData.feeDetails[0].amountPaying}</p>
          <p><strong>Payment Date:</strong> {paymentData.paymentDate}</p>
          <p><strong>Payment Mode:</strong> {paymentData.paymentMode}</p>
          <p><strong>Remarks:</strong> {paymentData.remarks}</p>
        </div>
      ) : (
        <p>No payment data available.</p>
      )}
    </div>
  );
}

export default PaymentRecept;
