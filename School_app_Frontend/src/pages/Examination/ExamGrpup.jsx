import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import FormSection from "../../components/Form/FormSection";
import Input from "../../components/Form/Input";
import FormButton from "../../components/Form/FormButton";

const ExamGrpup = () => {
  const [examGroupName, setExamGroupName] = useState("");
  const [examGroups, setExamGroups] = useState([]);
  const [editingGroupId, setEditingGroupId] = useState(null);

  const handleSave = () => {
    if (examGroupName.trim()) {
      if (editingGroupId) {
        setExamGroups(
          examGroups.map((group) =>
            group.id === editingGroupId
              ? { ...group, name: examGroupName }
              : group
          )
        );
        setEditingGroupId(null);
      } else {
        setExamGroups([
          ...examGroups,
          { id: examGroups.length + 1, name: examGroupName },
        ]);
      }
      setExamGroupName("");
    }
  };

  const handleEdit = (id) => {
    const group = examGroups.find((group) => group.id === id);
    setExamGroupName(group.name);
    setEditingGroupId(id);
  };

  const handleDelete = (id) => {
    setExamGroups(examGroups.filter((group) => group.id !== id));
  };

  return (
    <div className="flex">
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
                key={group.id}
                className="flex items-center p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-gray-900 border border-[#65FA9E]"
              >
                <label className="text-[#65FA9E] text-md font-medium flex-grow">
                  {group.name}
                </label>
                <div className="border-l-2 pl-4 border-[#65FA9E]">
                  <button
                    className="text-blue-500 mr-4"
                    onClick={() => handleEdit(group.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(group.id)}
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

export default ExamGrpup;
