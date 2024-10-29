import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const StudentsFeesPage = () => {
  const [students, setStudents] = useState([]);
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
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      if (response.data && response.data.statusCode === 200) {
        setStudents(response.data.data);
      } else {
        toast.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Error fetching students');
    }
  };

  // Handle fee submission
  const handleFeeSubmission = (studentId) => {
    // Navigate to fee submission page with student ID
    navigate(`/school/fee-submission/${studentId}`);
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
                  index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'
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
                  <button
                    onClick={() => handleFeeSubmission(student._id)}
                    className="flex items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-5 py-2 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
                  >
                    Submit Fee
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StudentsFeesPage;
