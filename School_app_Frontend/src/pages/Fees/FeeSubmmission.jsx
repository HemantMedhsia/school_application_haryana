import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FeeSubmission = () => {
  const { studentId } = useParams();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [feeDetails, setFeeDetails] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [totalFees, setTotalFees] = useState(0);
  const [monthMultiplier, setMonthMultiplier] = useState(0);

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  // Fetch student details from the API to get class ID
  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-student/${studentId}`
      );
      if (response.data && response.data.statusCode === 200) {
        const studentData = response.data.data;
        setStudentDetails(studentData);
        const classId = studentData.currentClass._id;
        fetchFeeGroups(classId);
      } else {
        console.error('Failed to fetch student details');
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  // Fetch fee group details from the API based on class ID
  const fetchFeeGroups = async (classId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-fee-group`
      );
      if (response.data && response.data.statusCode === 200) {
        const feeGroupData = response.data.message.filter(
          (group) => group.class._id === classId
        );

        if (feeGroupData.length > 0) {
          const group = feeGroupData[0]; // Assuming one group matches
          const feeDetailsFormatted = [
            {
              header: 'Tuition Fee (Monthly)',
              totalAmount: (group.fees.tuitionFee / 12).toFixed(2),
              dueAmount: 0,
              discount: 0,
              payingAmount: 0,
              paid: false,
            },
            {
              header: 'Admission Fee',
              totalAmount: group.fees.admissionFee.toFixed(2),
              dueAmount: group.fees.admissionFee.toFixed(2),
              discount: 0,
              payingAmount: group.fees.admissionFee.toFixed(2),
              paid: false,
            },
            {
              header: 'Annual Fee',
              totalAmount: group.fees.annualFee.toFixed(2),
              dueAmount: group.fees.annualFee.toFixed(2),
              discount: 0,
              payingAmount: group.fees.annualFee.toFixed(2),
              paid: false,
            },
            {
              header: 'Other Fee',
              totalAmount: group.fees.otherFee.toFixed(2),
              dueAmount: group.fees.otherFee.toFixed(2),
              discount: 0,
              payingAmount: group.fees.otherFee.toFixed(2),
              paid: false,
            },
          ];
          setFeeDetails(feeDetailsFormatted);
          calculateTotalFees(feeDetailsFormatted);
        } else {
          console.error('No matching fee group found for the class');
        }
      } else {
        console.error('Failed to fetch fee groups');
      }
    } catch (error) {
      console.error('Error fetching fee groups:', error);
    }
  };

  const handleMonthChange = (e) => {
    const multiplier = getMonthMultiplier(e.target.value);
    setMonthMultiplier(multiplier);
    const updatedFeeDetails = feeDetails.map((fee) => {
      if (fee.header === 'Tuition Fee (Monthly)') {
        let totalAmount = parseFloat(fee.totalAmount) * multiplier;
        let discount = parseFloat(fee.discount) || 0;
        let dueAmount = totalAmount - discount;
        return {
          ...fee,
          dueAmount: dueAmount.toFixed(2),
          payingAmount: dueAmount.toFixed(2), // Auto-fill payingAmount
        };
      }
      return fee;
    });
    setSelectedMonth(e.target.value);
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
    updatedFeeDetails[index][field] = value;

    let totalAmount = parseFloat(updatedFeeDetails[index]['totalAmount']) || 0;
    let discount = parseFloat(updatedFeeDetails[index]['discount']) || 0;

    if (updatedFeeDetails[index].header === 'Tuition Fee (Monthly)') {
      totalAmount = totalAmount * monthMultiplier;
    }

    let dueAmount = totalAmount - discount;
    updatedFeeDetails[index]['dueAmount'] = dueAmount.toFixed(2);

    // Auto-fill payingAmount when dueAmount changes, unless payingAmount was manually set
    if (field !== 'payingAmount') {
      updatedFeeDetails[index]['payingAmount'] = dueAmount.toFixed(2);
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
        discountAmount: fee.discount,
        discountGivenBy: fee.discount > 0 ? 'Principal' : '', // Adjust as needed
        amountPaying: fee.payingAmount,
      })),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: 'Cash', // You can change this to get input from user
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
    <div className="p-8 bg-gray-900 text-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-[#65fa9e]">Fee Submission</h2>
      {studentDetails && (
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-[#65fa9e]">
            Student Name: {studentDetails.firstName} {studentDetails.lastName}
          </h3>
          <p className="text-xl text-gray-300">
            Class: {studentDetails.currentClass.name}
          </p>
        </div>
      )}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-[#65fa9e]">
          Select Month
        </label>
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="p-3 border border-[#39424E] rounded w-full bg-[#283046] text-gray-100 focus:border-[#65fa9e]"
        >
          <option value="">Select a month</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
        </select>
      </div>

      <div className="mb-6 text-xl text-gray-300">
        <p>Month Multiplier: {monthMultiplier}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#283046] text-gray-100 rounded-lg">
          <thead>
            <tr className="bg-[#65fa9e] text-gray-900">
              <th className="py-3 px-4 border border-[#39424E] text-left">
                Fee Header
              </th>
              <th className="py-3 px-4 border border-[#39424E] text-left">
                Total Amount
              </th>
              <th className="py-3 px-4 border border-[#39424E] text-left">
                Calculation
              </th>
              <th className="py-3 px-4 border border-[#39424E] text-left">
                Due Amount
              </th>
              <th className="py-3 px-4 border border-[#39424E] text-left">
                Discount
              </th>
              <th className="py-3 px-4 border border-[#39424E] text-left">
                Amount Paying
              </th>
            </tr>
          </thead>
          <tbody>
            {feeDetails.map((fee, index) => (
              <tr
                key={index}
                className={`hover:bg-[#39424E] ${fee.paid ? 'opacity-50' : ''}`}
              >
                <td className="py-3 px-4 border border-[#39424E]">
                  {fee.header}
                </td>
                <td className="py-3 px-4 border border-[#39424E]">
                  {fee.header === 'Tuition Fee (Monthly)'
                    ? (
                        parseFloat(fee.totalAmount) * monthMultiplier
                      ).toFixed(2)
                    : fee.totalAmount}
                </td>
                <td className="py-3 px-4 border border-[#39424E]">
                  {fee.header === 'Tuition Fee (Monthly)'
                    ? `${fee.totalAmount} * ${monthMultiplier} = ${(
                        parseFloat(fee.totalAmount) * monthMultiplier
                      ).toFixed(2)}`
                    : '-'}
                </td>
                <td className="py-3 px-4 border border-[#39424E]">
                  {fee.dueAmount}
                </td>
                <td className="py-3 px-4 border border-[#39424E]">
                  <input
                    type="number"
                    value={fee.discount}
                    onChange={(e) =>
                      handleInputChange(index, 'discount', e.target.value)
                    }
                    className="p-2 border border-[#39424E] rounded w-full bg-gray-800 text-gray-100 focus:border-[#65fa9e]"
                    placeholder="Discount Amount"
                    disabled={fee.paid}
                  />
                </td>
                <td className="py-3 px-4 border border-[#39424E]">
                  <input
                    type="number"
                    value={fee.payingAmount}
                    onChange={(e) =>
                      handleInputChange(index, 'payingAmount', e.target.value)
                    }
                    className="p-2 border border-[#39424E] rounded w-full bg-gray-800 text-gray-100 focus:border-[#65fa9e]"
                    placeholder="Paying Amount"
                    disabled={fee.paid}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-xl font-bold text-[#65fa9e]">
        Total Fees: {totalFees}
      </div>

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
