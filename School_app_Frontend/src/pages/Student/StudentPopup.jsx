import React, { useState, useEffect } from "react";
import { getAPI } from "../../utility/api/apiCall";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";


const StudentSearchPopup = ({
  isOpen,
  onClose,
  onAddStudent,
  studentId,
  parent,
}) => {
  const [searchText, setSearchText] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  const fetchStudents = async () => {
    try {
      console.log(
        "Fetching siblings for student:",
        studentId,
        "and parent:",
        parent
      );
      const response = await getAPI("getAllStudents", {}, setStudents);
      if (response.data && Array.isArray(response.data)) {
        setStudents(response.data);
        setFilteredStudents(response.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);

    if (text) {
      const filtered = students.filter((student) =>
        `${student.firstName} ${student.lastName} ${student.rollNumber}`
          .toLowerCase()
          .includes(text.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  };

  const handleAddSibling = async (selectedStudentId) => {
    if (!studentId || !parent) {
      console.log(parent._id);
      console.error("Student ID or Parent ID is missing!");
      return;
    }

    const payload = {
      primaryStudentId: studentId,
      studentIds: [selectedStudentId],
      parentId: parent._id,
    };

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/add-or-update-sibling`,
        payload
      );

      if (response.status === 200) {
        console.log("Sibling added successfully:", response.data);
        onAddStudent(response.data); // Callback to notify the parent component
      } else {
        console.error("Failed to add sibling:", response.data);
        toast.error("Failed to add sibling.");
      }
    } catch (error) {
      console.error("Error adding sibling:", error);
      const errorMessage =
        error.response?.data?.data ||
        "An error occurred while adding the sibling.";
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${
        isOpen ? "" : "hidden"
      }`}
      style={{ zIndex: 1000 }}
    >
      <div className="bg-white p-8 rounded-lg w-4/5 max-h-[85%] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Search and Add Siblings
          </h2>
          <button onClick={onClose} className="text-red-500 text-xl font-bold">
            &times;
          </button>
        </div>
        <input
          type="text"
          placeholder="Search students..."
          value={searchText}
          onChange={handleSearch}
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {filteredStudents.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No students found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={
                      student.studentPhoto || "https://via.placeholder.com/50"
                    }
                    alt={`${student.firstName} ${student.lastName}`}
                    className="w-16 h-16 rounded-full border border-gray-300 object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700">
                      {`${student.firstName} ${student.lastName}`}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Roll No: {student.rollNumber}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  <strong>Father's Name:</strong>{" "}
                  {student.parent?.fatherName || "N/A"}
                </p>
                <button
                  onClick={() => handleAddSibling(student._id)}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Add Student
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default StudentSearchPopup;
