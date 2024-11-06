import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormSection from "../../components/Form/FormSection";
import Input from "../../components/Form/Input";
import FormButton from "../../components/Form/FormButton";
import ConfirmationModal from "../../common/ConfirmationModal/ConfirmationModal";

const ExamGroup = () => {
  const [examGroupName, setExamGroupName] = useState("");
  const [examGroups, setExamGroups] = useState([]);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async () => {
    if (examGroupName.trim()) {
      if (editingGroupId) {
        await handleUpdate();
      } else {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/create-examgroup`,
            { name: examGroupName }
          );
          if (response.status === 201) {
            const newGroup = response.data.data;
            setExamGroups([...examGroups, newGroup]);
            toast.success("Exam group created successfully!");
          }
        } catch (error) {
          toast.error("Error creating exam group.");
        }
      }
      setExamGroupName("");
    } else {
      toast.warn("Exam group name cannot be empty.");
    }
  };

  const handleUpdate = async () => {
    if (editingGroupId && examGroupName.trim()) {
      try {
        const response = await axios.put(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/update-examgroup/${editingGroupId}`,
          { name: examGroupName }
        );
        if (response.status === 200) {
          setExamGroups(
            examGroups.map((group) =>
              group._id === editingGroupId
                ? { ...group, name: examGroupName }
                : group
            )
          );
          setEditingGroupId(null);
          setExamGroupName("");
          toast.success("Exam group updated successfully!");
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/delete-examgroup/${id}`
      );
      setExamGroups(examGroups.filter((group) => group._id !== id));
      toast.success("Exam group deleted successfully!");
    } catch (error) {
      toast.error("Error deleting exam group.");
    }
  };

  useEffect(() => {
    const fetchExamGroups = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/get-examgroup`
        );
        setExamGroups(response.data.data);
      } catch (error) {
        toast.error("Error fetching exam groups.");
      } finally {
        setLoading(false);
      }
    };
    fetchExamGroups();
  }, []);

  const handleEdit = (id) => {
    const group = examGroups.find((group) => group._id === id);
    setExamGroupName(group.name);
    setEditingGroupId(id);
  };

  const handleDeleteClick = (group) => {
    setGroupToDelete(group);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setGroupToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!groupToDelete) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/delete-examgroup/${
          groupToDelete._id
        }`
      );
      setExamGroups(
        examGroups.filter((group) => group._id !== groupToDelete._id)
      );
      toast.success("Exam group deleted successfully!");
    } catch (error) {
      toast.error("Error deleting exam group.");
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
    <div className="flex">
      <ToastContainer />
      <div className="w-1/2">
        <FormSection title="Create Exam Group">
          <Input
            labelName="Exam Group Name"
            type="text"
            placeholder="Enter exam group name"
            value={examGroupName}
            onChange={(e) => setExamGroupName(e.target.value)}
          />
        </FormSection>
        <div className="flex">
          <FormButton
            name={editingGroupId ? "Update" : "Save"}
            onClick={handleSave}
          />
        </div>
      </div>
      <div className="mt-6 w-1/2 p-16">
        <label className="block text-lg font-medium text-[#7367F0] mb-4">
          Exam Groups
        </label>
        {examGroups.length > 0 ? (
          <div className="grid grid-cols-1 w-full sm:grid-cols-1 lg:grid-cols-1 gap-4">
            {examGroups.map((group) => (
              <div
                key={group._id}
                className="flex items-center p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-gray-900 border border-[#65FA9E]"
              >
                <label className="text-[#65FA9E] text-md font-medium flex-grow">
                  {group.name}
                </label>
                <div className="border-l-2 pl-4 border-[#65FA9E]">
                  <button
                    className="text-blue-500 mr-4"
                    onClick={() => handleEdit(group._id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDeleteClick(group)}
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
        onClose={closeModal}
        onConfirm={confirmDelete}
        title="Delete Confirmation"
        message={`Are you sure you want to delete the exam group "${groupToDelete?.name}"?`}
      />
    </div>
  );
};

export default ExamGroup;
