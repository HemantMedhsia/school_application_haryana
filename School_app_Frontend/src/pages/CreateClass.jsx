import React, { useEffect, useState } from "react";
import FormSection from "../components/Form/FormSection";
import Input from "../components/Form/Input";
import Select from "../components/Form/Select";
import FormButton from "../components/Form/FormButton";
import CheckboxGroup from "../components/Form/CheckboxGroup";
import { getAPI } from "../utility/api/apiCall";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import ConfirmationModal from "../common/ConfirmationModal/ConfirmationModal";
const CreateClass = ({ onCreate }) => {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [className, setClassName] = useState("");
  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState([]);
  const [editingClassId, setEditingClassId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await getAPI(
        "getAllClassesWithSections",
        {},
        setClasses
      );
      console.log(response.data);
      const formattedClasses = response.data.map((classItem) => ({
        id: classItem.id,
        name: classItem.className,
        sections: classItem.sections.map((section) => section.name),
      }));

      setClasses(formattedClasses);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    setLoading(true);
    try {
      const response = await getAPI("getAllSections", {}, setOptions);
      console.log(response.data);
      setOptions(response.data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchClasses();
  }, []);

  const handleCheckboxChange = (updatedValues) => {
    console.log("Updated checkboxes:", updatedValues);
    setSelectedCheckboxes(updatedValues);
  };

  const handleClassNameChange = (e) => {
    setClassName(e.target.value);
  };

  const handleSubmit = async () => {
    const newClass = {
      name: className,
      sections: selectedCheckboxes,
    };
    console.log("newClass:", newClass);

    try {
      let response;

      if (editingClassId) {
        // Update existing class
        response = await axios.put(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/update-class/${editingClassId}`,
          newClass
        );
        toast.success("Class updated successfully!");
      } else {
        // Create new class
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/create-class`,
          newClass
        );
        toast.success("Class created successfully!");
      }

      // Re-fetch classes to update the list after submitting
      fetchClasses();

      // Reset the form
      setClassName("");
      setSelectedCheckboxes([]);
      setEditingClassId(null);

      if (onCreate) onCreate();
    } catch (error) {
      console.error("Error submitting class:", error);
      toast.error("Failed to create or update class.");
    }
  };

  const handleEdit = (classItem) => {
    setEditingClassId(classItem.id);
    setClassName(classItem.name);
    setSelectedCheckboxes(classItem.sections);
  };

  const openDeleteModal = (classId) => {
    setIsModalOpen(true);
    setClassToDelete(classId);
  };

  const handleDelete = async () => {
    console.log("Deleting class:", classToDelete);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/delete-class/${classToDelete}`
      );
      toast.success("Class deleted successfully!");
      setClasses(classes.filter((cls) => cls.id !== classToDelete));
    } catch (error) {
      console.error("Error deleting class:", error);
      toast.error("Failed to delete class.");
    } finally {
      setIsModalOpen(false);
      setClassToDelete(null);
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
    <div className="mt-4 flex">
      <div className="w-2/3 p-4 bg-[#283046] rounded-md">
        <FormSection title={editingClassId ? "Edit Class" : "Create Class"}>
          <Input
            labelName="Class Name"
            type="text"
            placeholder="Enter class name"
            value={className}
            onChange={handleClassNameChange}
          />
          <CheckboxGroup
            labelName="Select Sections"
            name="checkboxOptions"
            selectedValues={selectedCheckboxes}
            onChange={handleCheckboxChange}
            options={options}
          />
        </FormSection>
        <div className="flex mt-6">
          <FormButton
            name={editingClassId ? "Update Class" : "Create Class"}
            onClick={handleSubmit}
          />
        </div>
      </div>
      <div className="w-1/3 pl-4">
        <div className="bg-[#283046] text-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-6 text-[#7367F0]">
            Created Classes
          </h3>

          <ul>
            {classes.length > 0 ? (
              classes.map((classItem, index) => (
                <li
                  key={index}
                  className="mb-4 p-4 bg-gray-700 rounded-lg shadow hover:bg-gray-600 transition duration-200"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-[#7367F0]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 14l9-5-9-5-9 5 9 5z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <strong className="text-lg">
                        Class: {classItem.name}
                      </strong>
                      <p className="text-sm text-gray-400">
                        Sections: {classItem.sections.join(", ")}
                      </p>
                      <div className="flex space-x-4 mt-2">
                        <FaEdit
                          className="text-yellow-400 cursor-pointer"
                          onClick={() => handleEdit(classItem)}
                        />
                        <FaTrash
                          className="text-red-500 cursor-pointer"
                          onClick={() => openDeleteModal(classItem.id)}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-400">No classes created yet.</li>
            )}
          </ul>
        </div>
      </div>
      <ToastContainer />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Class"
        message="Are you sure you want to delete this class? This action cannot be undone."
      />
    </div>
  );
};

export default CreateClass;
