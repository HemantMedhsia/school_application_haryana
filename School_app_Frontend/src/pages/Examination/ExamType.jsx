import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormSection from "../../components/Form/FormSection";
import Input from "../../components/Form/Input";
import FormButton from "../../components/Form/FormButton";
import SearchableSelect from "../../components/Form/Select";
import { getAPI } from "../../utility/api/apiCall";
import axios from "axios";

const ExamGroup = () => {
  const [examGroupName, setExamGroupName] = useState("");
  const [examGroups, setExamGroups] = useState([]);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [passingMarks, setPassingMarks] = useState("");
  const [examCategories, setExamCategories] = useState([]);

  const fetchExamCategories = async () => {
    await getAPI("getAllExamCategories", {}, setExamCategories);
  };

  const fetchExamTypes = async () => {
    await getAPI("getAllExamTypes", {}, setExamGroups);
    // console.log("Exam Types", examGroups);
  };

  useEffect(() => {
    fetchExamCategories();
    fetchExamTypes();
  }, []);

  const handleSave = async () => {
    if (
      examGroupName.trim() &&
      selectedCategory &&
      totalMarks &&
      passingMarks
    ) {
      if (editingGroupId) {
        // Update existing exam group using API
        try {
          await axios.put(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/update-examtype/${editingGroupId}`, // Correctly appending the group ID
            {
              name: examGroupName,
              termId: selectedCategory, // Correct term/category field
              maxMarks: totalMarks,
              minMarks: passingMarks,
            },
            fetchExamTypes() // Refresh the list after updating
          );
          // Update the local state after successful API update
          setExamGroups(
            examGroups.map((group) =>
              group._id === editingGroupId
                ? {
                    ...group,
                    name: examGroupName,
                    termId: selectedCategory,
                    maxMarks: totalMarks,
                    minMarks: passingMarks,
                  }
                : group
            )
          );
          setEditingGroupId(null); // Reset the edit mode
          toast.success("Exam group updated successfully!");
        } catch (error) {
          // console.error("Error updating exam type:", error);
          toast.error("Failed to update exam type.");
        }
      } else {
        // Create new exam group using API
        try {
          await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/create-examtype`,
            {
              name: examGroupName,
              termId: selectedCategory,
              maxMarks: totalMarks,
              minMarks: passingMarks,
            }
          );
          fetchExamTypes(); // Refresh the list after adding a new entry
          toast.success("Exam type saved successfully!");
        } catch (error) {
          // console.error("Error:", error);
          toast.error("Failed to save exam type.");
        }
      }
      // Clear form after saving/updating
      setExamGroupName("");
      setSelectedCategory(null);
      setTotalMarks("");
      setPassingMarks("");
    } else {
      toast.warn("Please fill all fields.");
    }
  };

  const handleEdit = (id) => {
    const group = examGroups.find((group) => group._id === id);
    if (group) {
      setExamGroupName(group.name);
      setSelectedCategory(group.termId);
      setTotalMarks(group.maxMarks);
      setPassingMarks(group.minMarks);
      setEditingGroupId(id);
    } else {
      toast.error("Exam type not found.");
    }
  };

  const handleDelete = (id) => {
    try {
      axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/delete-examtype/${id}`
      );
      setExamGroups(examGroups.filter((group) => group._id !== id));
      toast.success("Exam group deleted successfully!");
    } catch (error) {
      // console.error("Failed to delete exam type", error);
      toast.error("Failed to delete exam type.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:space-y-0">
      <ToastContainer /> {/* Add ToastContainer to display notifications */}
      <div className="w-full md:w-2/3 rounded-lg shadow-md p-6">
        <FormSection title="Exam Type">
          <Input
            labelName="Exam Type Name"
            type="text"
            placeholder="Enter exam group name"
            value={examGroupName}
            onChange={(e) => setExamGroupName(e.target.value)}
          />
          <SearchableSelect
            labelName="Select Exam Category"
            options={examCategories.map((category) => ({
              id: category._id,
              name: category.name,
            }))}
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
            }}
          />
        </FormSection>

        <FormSection title="Marks">
          <Input
            labelName="Total Marks"
            type="number"
            placeholder="Enter total marks"
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
          />
          <Input
            labelName="Passing Marks"
            type="number"
            placeholder="Enter passing marks"
            value={passingMarks}
            onChange={(e) => setPassingMarks(e.target.value)}
          />
        </FormSection>

        <div className="flex">
          <FormButton
            name={editingGroupId ? "Update" : "Save"}
            onClick={handleSave}
          />
        </div>
      </div>
      <div className="w-full md:w-1/3 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Exam Types</h2>
        {examGroups.length > 0 ? (
          <div className="space-y-4">
            {examGroups.map((group) => (
              <div key={group._id} className="flex flex-col p-4 rounded-lg">
                <p className="font-semibold text-lg">{group.name}</p>
                <p className="text-gray-700">Category: {group.term?.name}</p>
                <p className="text-gray-700">Total Marks: {group.maxMarks}</p>
                <p className="text-gray-700">Passing Marks: {group.minMarks}</p>
                <div className="flex space-x-2 mt-2">
                  <button
                    className="text-blue-500"
                    onClick={() => handleEdit(group._id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(group._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No exam groups available</p>
        )}
      </div>
    </div>
  );
};

export default ExamGroup;
