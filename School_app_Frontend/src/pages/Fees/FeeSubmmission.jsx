import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FeeSubmission = () => {
  const { studentId } = useParams();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [feeDetails, setFeeDetails] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [totalFees, setTotalFees] = useState(0);
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Mapping between feeHeader identifiers and display names
  const feeHeaderMap = {
    tuitionFee: 'Tuition Fee',
    admissionFee: 'Admission Fee',
    annualFee: 'Annual Fee',
    otherFee: 'Other Fee',
  };

  const feeHeaderMapReverse = {
    'Tuition Fee (Monthly)': 'tuitionFee',
    'Admission Fee': 'admissionFee',
    'Annual Fee': 'annualFee',
    'Other Fee': 'otherFee',
  };

  useEffect(() => {
    fetchStudentFeeDetails();
  }, []);

  // Fetch student fee details from the API endpoint
  const fetchStudentFeeDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-student-fee/${studentId}`
      );
      if (response.data && response.data.success) {
        const data = response.data.data; // Adjusted to match new API response structure
        setStudentDetails(data.student);
        initializeFeeDetails(data.studentFee);
        setPaymentHistory(data.studentFee.paymentHistory);
      } else {
        console.error('Failed to fetch student fee details');
      }
    } catch (error) {
      console.error('Error fetching student fee details:', error);
    }
  };

  // Initialize fee details based on the API response
  const initializeFeeDetails = (studentFeeData) => {
    const feeDetailsFormatted = studentFeeData.feeDetails.map((feeDetail) => {
      const header = feeHeaderMap[feeDetail.feeHeader] || feeDetail.feeHeader;
      return {
        feeHeader: feeDetail.feeHeader, // keep the feeHeader as is
        header: header,
        originalAmount: feeDetail.originalAmount,
        totalAmount: feeDetail.originalAmount,
        dueAmount: feeDetail.dueAmount,
        paidAmount: feeDetail.paymentAmount,
        discountAmount: feeDetail.discountAmount,
        discount: 0,
        payingAmount: 0,
      };
    });
    setFeeDetails(feeDetailsFormatted);
    calculateTotalFees(feeDetailsFormatted);
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    const multiplier = getMonthMultiplier(month);
    const updatedFeeDetails = feeDetails.map((fee) => {
      if (fee.feeHeader === 'tuitionFee') {
        const totalAmount = (parseFloat(fee.originalAmount) / 12) * multiplier;
        const dueAmount = Math.max(totalAmount - fee.paidAmount - parseFloat(fee.discount || 0), 0);
        return {
          ...fee,
          totalAmount: totalAmount.toFixed(2),
          dueAmount: dueAmount.toFixed(2),
          payingAmount: dueAmount.toFixed(2),
        };
      }
      return fee;
    });
    setSelectedMonth(month);
    setFeeDetails(updatedFeeDetails);
    calculateTotalFees(updatedFeeDetails);
  };

  const getMonthMultiplier = (month) => {
    const months = [
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
      'January',
      'February',
      'March', 
    ];
    return months.indexOf(month) + 1;
  };

  const handleInputChange = (index, field, value) => {
    const updatedFeeDetails = [...feeDetails];
    const parsedValue = parseFloat(value);
    updatedFeeDetails[index][field] = !isNaN(parsedValue) ? parsedValue : 0;

    if (field === 'discount' || field === 'payingAmount') {
      const totalAmount = parseFloat(updatedFeeDetails[index]['totalAmount']) || 0;
      let discount = parseFloat(updatedFeeDetails[index]['discount']) || 0;
      const paidAmount = parseFloat(updatedFeeDetails[index]['paidAmount']) || 0;

      // Ensure discount doesn't exceed the remaining amount after payments
      if (discount > totalAmount - paidAmount) {
        discount = totalAmount - paidAmount;
        updatedFeeDetails[index]['discount'] = discount;
      }

      // Calculate due amount considering total amount, paid amount, and discount
      let dueAmount = totalAmount - paidAmount - discount;
      dueAmount = dueAmount > 0 ? dueAmount : 0;
      updatedFeeDetails[index]['dueAmount'] = dueAmount;

      // Auto-fill payingAmount when dueAmount changes, unless payingAmount was manually set
      if (field !== 'payingAmount') {
        updatedFeeDetails[index]['payingAmount'] = dueAmount;
      }
    }

    setFeeDetails(updatedFeeDetails);
    calculateTotalFees(updatedFeeDetails);
  };

  const calculateTotalFees = (feeDetails) => {
    const total = feeDetails.reduce((acc, fee) => {
      let payingAmount = parseFloat(fee.payingAmount);
      if (isNaN(payingAmount)) {
        payingAmount = 0;
      }
      acc += payingAmount;
      return acc;
    }, 0);
    setTotalFees(total.toFixed(2));
  };

  const handleSubmit = async () => {
    const payload = {
      studentId,
      feeDetails: feeDetails.map((fee) => ({
        feeHeader: fee.header,
        discountAmount: Number(fee.discount) || 0,
        discountGivenBy: fee.discount > 0 ? 'Principal' : '', // Adjust as needed
        amountPaying: Number(fee.payingAmount) || 0,
      })),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: 'Cash', // Can be changed to get input from user
      remarks: 'Payment for multiple fee headers.',
      totalPayingAmount: totalFees,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/add-student-fee`,
        payload
      );
      if (response.data && response.data.statusCode === 200) {
        console.log('Fee submission successful:', response.data);
        alert('Fee submitted successfully');
        // Refresh the fee details after successful submission
        fetchStudentFeeDetails();
      } else {
        console.error('Failed to submit fee:', response.data);
        alert('Failed to submit fee');
      }
    } catch (error) {
      console.error('Error submitting fee:', error);
      alert('Error submitting fee');
    }
  };

  return (
    <div className=" bg-gray-900 text-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-[#65fa9e]">Fee Submission</h2>
      {studentDetails && (
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-[#65fa9e]">
            Student Name: {studentDetails.name}
          </h3>
          <p className="text-xl text-gray-300">Class: {studentDetails.class.name}</p>
        </div>
      )}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-[#65fa9e]">Select Month</label>
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="p-3 border border-[#39424E] rounded w-full bg-[#283046] text-gray-100 focus:border-[#65fa9e]"
        >
          <option value="">Select a month</option>
          {[
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
            'January',
            'February',
            'March',
          ].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#283046] text-gray-100 rounded-lg">
          <thead>
            <tr className="bg-[#65fa9e] text-gray-900">
              <th className="py-3 px-4 border border-[#39424E] text-left">Fee Header</th>
              <th className="py-3 px-4 border border-[#39424E] text-left">Total Amount</th>
              <th className="py-3 px-4 border border-[#39424E] text-left">Paid Amount</th>
              <th className="py-3 px-4 border border-[#39424E] text-left">Due Amount</th>
              <th className="py-3 px-4 border border-[#39424E] text-left">Discount</th>
              <th className="py-3 px-4 border border-[#39424E] text-left">Amount Paying</th>
            </tr>
          </thead>
          <tbody>
            {feeDetails.map((fee, index) => (
              <tr key={index} className="hover:bg-[#39424E]">
                <td className="py-3 px-4 border border-[#39424E]">{fee.header}</td>
                <td className="py-3 px-4 border border-[#39424E]">
                  {fee.totalAmount ? fee.totalAmount : fee.originalAmount}
                </td>
                <td className="py-3 px-4 border border-[#39424E]">
                  {fee.paidAmount.toFixed(2)}
                </td>
                <td className="py-3 px-4 border border-[#39424E]">{fee.dueAmount}</td>
                <td className="py-3 px-4 border border-[#39424E]">
                  <input
                    type="number"
                    value={fee.discount}
                    onChange={(e) => handleInputChange(index, 'discount', e.target.value)}
                    className="p-2 border border-[#39424E] rounded w-full bg-gray-100 text-gray-900 focus:border-[#65fa9e]"
                    placeholder="Discount Amount"
                  />
                </td>
                <td className="py-3 px-4 border border-[#39424E]">
                  <input
                    type="number"
                    value={fee.payingAmount}
                    onChange={(e) => handleInputChange(index, 'payingAmount', e.target.value)}
                    className="p-2 border border-[#39424E] rounded w-full bg-gray-100 text-gray-900 focus:border-[#65fa9e]"
                    placeholder="Paying Amount"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-[#65fa9e] mb-4">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#283046] text-gray-100 rounded-lg">
            <thead>
              <tr className="bg-[#65fa9e] text-gray-900">
                <th className="py-3 px-4 border border-[#39424E] text-left">Payment Date</th>
                <th className="py-3 px-4 border border-[#39424E] text-left">Fee Header</th>
                <th className="py-3 px-4 border border-[#39424E] text-left">Amount</th>
                <th className="py-3 px-4 border border-[#39424E] text-left">Receipt Number</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment, index) => (
                <tr key={index} className="hover:bg-[#39424E]">
                  <td className="py-3 px-4 border border-[#39424E]">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border border-[#39424E]">{payment.feeHeader}</td>
                  <td className="py-3 px-4 border border-[#39424E]">
                    {payment.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 border border-[#39424E]">
                    {payment.receiptNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-xl font-bold text-[#65fa9e]">Total Fees: {totalFees}</div>

      <div className="mt-8">
        <button
          onClick={handleSubmit}
          className="bg-[#65fa9e] text-gray-900 px-6 py-3 rounded-lg shadow-md hover:bg-[#54e088] transition duration-300"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FeeSubmission;
