import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import FormSection from "../../components/Form/FormSection";
import Input from "../../components/Form/Input";
import FormButton from "../../components/Form/FormButton";
import SearchableSelect from "../../components/Form/Select";

const ExamGroup = () => {
  const [examGroupName, setExamGroupName] = useState("");
  const [examGroups, setExamGroups] = useState([]);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [passingMarks, setPassingMarks] = useState("");

  // Dummy data for the exam category
  const examCategories = [
    { id: "Math",    name: "Mathematics" },
    { id: "Science", name: "Science" },
    { id: "History", name: "History" },
    { id: "English", name: "English" },
  ];

  const handleSave = () => {
    if (examGroupName.trim() && selectedCategory && totalMarks && passingMarks) {
      if (editingGroupId) {
        setExamGroups(
          examGroups.map((group) =>
            group.id === editingGroupId
              ? {
                  ...group,
                  name: examGroupName,
                  category: selectedCategory,
                  totalMarks,
                  passingMarks,
                }
              : group
          )
        );
        setEditingGroupId(null);
      } else {
        setExamGroups([
          ...examGroups,
          {
            id: examGroups.length + 1,
            name: examGroupName,
            category: selectedCategory,
            totalMarks,
            passingMarks,
          },
        ]);
      }
      setExamGroupName("");
      setSelectedCategory("");
      setTotalMarks("");
      setPassingMarks("");
    }
  };

  const handleEdit = (id) => {
    const group = examGroups.find((group) => group.id === id);
    setExamGroupName(group.name);
    setSelectedCategory(group.category);
    setTotalMarks(group.totalMarks);
    setPassingMarks(group.passingMarks);
    setEditingGroupId(id);
  };

  const handleDelete = (id) => {
    setExamGroups(examGroups.filter((group) => group.id !== id));
  };

  return (
    <div className="flex flex-col md:flex-row md:space-y-0">
      <div className="w-full md:w-2/3 rounded-lg shadow-md p-6">
        <FormSection title="Exam Type">
          <Input
            labelName="Exam Type Name"
            type="text"
            placeholder="Enter exam group name"
            value={examGroupName}
            onChange={(e) => setExamGroupName(e.target.value)}
          />
          {/* Passing dummy data to SearchableSelect */}
          <SearchableSelect
            labelName="Select Exam Category"
            options={examCategories} // Pass dummy options
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
        <h2 className="text-2xl font-bold mb-4">Exam Groups</h2>
        {examGroups.length > 0 ? (
          <div className="space-y-4">
            {examGroups.map((group) => (
              <div
                key={group.id}
                className="flex flex-col p-4 rounded-lg"
              >
                <p className="font-semibold text-lg">{group.name}</p>
                <p className="text-gray-700">Category: {group.category}</p>
                <p className="text-gray-700">Total Marks: {group.totalMarks}</p>
                <p className="text-gray-700">Passing Marks: {group.passingMarks}</p>
                <div className="flex space-x-2 mt-2">
                  <button
                    className="text-blue-500"
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

export default ExamGroup;
