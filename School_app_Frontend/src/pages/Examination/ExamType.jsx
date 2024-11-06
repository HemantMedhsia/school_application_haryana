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
import ConfirmationModal from "../../common/ConfirmationModal/ConfirmationModal"; // Import the ConfirmationModal

const ExamGroup = () => {
  const [examGroupName, setExamGroupName] = useState("");
  const [examGroups, setExamGroups] = useState([]);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [passingMarks, setPassingMarks] = useState("");
  const [examCategories, setExamCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the confirmation modal
  const [groupToDelete, setGroupToDelete] = useState(null); // Store the group that will be deleted

  const fetchExamCategories = async () => {
    setLoading(true);
    await getAPI("getAllExamCategories", {}, setExamCategories);
    setLoading(false);
  };

  const fetchExamTypes = async () => {
    await getAPI("getAllExamTypes", {}, setExamGroups);
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
        try {
          await axios.put(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/update-examtype/${editingGroupId}`,
            {
              name: examGroupName,
              termId: selectedCategory,
              maxMarks: totalMarks,
              minMarks: passingMarks,
            }
          );
          fetchExamTypes();
          setEditingGroupId(null);
          toast.success("Exam group updated successfully!");
        } catch (error) {
          toast.error("Failed to update exam type.");
        }
      } else {
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
          fetchExamTypes();
          toast.success("Exam type saved successfully!");
        } catch (error) {
          toast.error("Failed to save exam type.");
        }
      }
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

  const handleDeleteClick = (id) => {
    setGroupToDelete(id);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (groupToDelete) {
      try {
        await axios.delete(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/delete-examtype/${groupToDelete}`
        );
        setExamGroups(
          examGroups.filter((group) => group._id !== groupToDelete)
        );
        toast.success("Exam group deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete exam type.");
      } finally {
        setIsModalOpen(false);
        setGroupToDelete(null);
      }
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
    <div className="flex flex-col md:flex-row md:space-y-0">
      <ToastContainer />
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
                    onClick={() => handleDeleteClick(group._id)}
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Confirmation"
        message="Are you sure you want to delete this exam group?"
      />
    </div>
  );
};

export default ExamGroup;
