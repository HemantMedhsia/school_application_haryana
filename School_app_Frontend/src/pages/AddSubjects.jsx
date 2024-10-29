// AddSubjects.jsx
import React, { useEffect, useState } from "react";
import { getAPI } from "../utility/api/apiCall";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../common/ConfirmationModal/ConfirmationModal"; // Import the ConfirmationModal

const AddSubjects = () => {
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null); // State for subject to delete
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await getAPI("getAllSubjects", {}, setSubjects);
      console.log(response.data);
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching sections", error);
      toast.error("Error fetching sections");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    const schoolId = import.meta.env.VITE_SchoolId;
    e.preventDefault();
    try {
      if (editingSubject) {
        const updatedSubject = { name: subjectName, code: subjectCode };
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/subject-update/${editingSubject._id}`,
          { name: subjectName, code: subjectCode }
        );
        setSubjects((prev) =>
          prev.map((subject) =>
            subject._id === editingSubject._id ? updatedSubject : subject
          )
        );
        toast.success("Subject updated successfully");
      } else {
        const newSubject = { name: subjectName, code: subjectCode };
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/create-subject/${schoolId}`,
          { name: subjectName, code: subjectCode }
        );
        setSubjects([...subjects, newSubject]);
        toast.success("Subject added successfully");
      }
      fetchSubjects();
      setSubjectName("");
      setSubjectCode("");
      setEditingSubject(null);
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error(error.response?.data?.message || "Error submitting form");
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setSubjectName(subject.name);
    setSubjectCode(subject.code);
  };

  const handleDeleteClick = (subject) => {
    setSubjectToDelete(subject);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSubjectToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!subjectToDelete) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/subject-delete/${subjectToDelete._id}`
      );
      setSubjects(subjects.filter((subject) => subject._id !== subjectToDelete._id));
      toast.success("Subject deleted successfully");
    } catch (error) {
      console.error("Error deleting subject", error);
      toast.error("Error deleting subject");
    } finally {
      closeModal();
    }
  };

  if (loading) {
    return (
      <div className="loader-wrapper">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#283046] rounded-md p-8">
      <div className="flex-1">
        <div className="w-full bg-gray-900 text-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-[#7367F0] mb-6">
            {editingSubject ? "Edit Subject" : "Add New Subject"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="subjectName" className="block text-lg font-medium">
                Subject Name
              </label>
              <input
                type="text"
                id="subjectName"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full p-2 bg-gray-800 rounded-lg text-gray-100 mt-1"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="subjectCode" className="block text-lg font-medium">
                Subject Code
              </label>
              <input
                type="text"
                id="subjectCode"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="w-full p-2 bg-gray-800 rounded-lg text-gray-100 mt-1"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white p-2 rounded-lg shadow-md hover:from-green-600 hover:to-blue-700 transition"
            >
              {editingSubject ? "Update Subject" : "Add Subject"}
            </button>
          </form>
        </div>
      </div>
      {/* Display Added Subjects */}
      <div className="flex-1 ml-0 md:ml-8 mt-8 md:mt-0">
        <div className="w-full text-gray-100 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold text-[#7367F0] mb-6">
            Subjects List
          </h2>

          <div className="h-96 overflow-y-scroll">
            <ul className="space-y-4">
              {subjects.map((subject, index) => (
                <li
                  key={index}
                  className="bg-gray-900 p-4 rounded-lg shadow-lg flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-bold">
                      <strong>Name:</strong> {subject.name}
                    </p>
                    <p className="text-lg">
                      <strong>Code:</strong> {subject.code}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button onClick={() => handleEdit(subject)}>
                      <FaEdit className="text-yellow-500 text-2xl hover:text-yellow-400" />
                    </button>
                    <button onClick={() => handleDeleteClick(subject)}>
                      <FaTrash className="text-red-500 text-2xl hover:text-red-400" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        title="Delete Confirmation"
        message={`Are you sure you want to delete the subject "${subjectToDelete?.name}"?`}
      />

      <ToastContainer />
    </div>
  );
};

export default AddSubjects;
