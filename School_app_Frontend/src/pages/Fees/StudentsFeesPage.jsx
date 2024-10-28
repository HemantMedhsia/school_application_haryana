import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-all-students`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Students List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Student Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Admission No</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Class</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Section</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td className="py-2 px-4 border-b border-gray-200">{`${student.firstName} ${student.lastName}`}</td>
                <td className="py-2 px-4 border-b border-gray-200">{student.admissionNo}</td>
                <td className="py-2 px-4 border-b border-gray-200">{`Class ${student.currentClass.name}`}</td>
                <td className="py-2 px-4 border-b border-gray-200">{student.currentSection.name}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <button
                    onClick={() => handleFeeSubmission(student._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
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
