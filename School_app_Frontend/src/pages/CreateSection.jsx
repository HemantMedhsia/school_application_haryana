import React, { useEffect, useState } from "react";
import Input from "../components/Form/Input";
import FormButton from "../components/Form/FormButton";
import { deleteAPI, getAPI } from "../utility/api/apiCall";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateSection = () => {
  const [sectionName, setSectionName] = useState("");
  const [sections, setSections] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (sectionName.trim() !== "") {
      try {
        if (isEditing) {
          await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/update-section/${
              sections[editingIndex]._id
            }`,
            { name: sectionName }
          );
          toast.success("Section updated successfully!");
        } else {
          await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/create-single-section`,
            { name: sectionName }
          );
          toast.success("Section created successfully!");
        }
        fetchSections();
        setSectionName("");
        setIsEditing(false);
        setEditingIndex(null);
      } catch (error) {
        console.error("Error saving section", error.message);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    } else {
      console.log("Section name is empty");
      toast.warning("Section name is empty");
    }
  };

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await getAPI("getAllSections", {}, setSections);
      setSections(response.data);
    } catch (error) {
      console.error("Error fetching sections", error);
      toast.error("Error fetching sections");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSection = (index) => {
    setSectionName(sections[index].name);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const handleDeleteSection = async (index) => {
    try {
      await deleteAPI(`delete-single-section/${sections[index]._id}`);
      setSections(sections.filter((_, i) => i !== index));
      toast.success("Section deleted successfully!");
    } catch (error) {
      console.error("Error deleting section", error);
      toast.error("Error deleting section");
    }
  };

  return (
    <div className="flex">
      {/* Left Side: Form */}
      <div className="w-1/2 mt-8">
        <form
          onSubmit={handleAddSection} // Handles the form submission
          className="w-full bg-gray-900 text-gray-100 p-4 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-semibold text-[#7367F0] mb-6">
            Create Section
          </h2>
          <Input
            labelName="Section Name"
            type="text"
            placeholder="Enter section name"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
          />
          <div className="ml-2 flex">
            <FormButton name="Save" />
          </div>
        </form>
      </div>

      {/* Right Side: Display Sections */}

      <div className="w-1/2 mt-8 ml-4">
        <div className="w-full p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-[#7367F0] mb-6">
            Sections
          </h2>

          {loading ? (
            <div className="flex ">
              <span className="loader"></span>
            </div>
          ) : (
            sections.length === 0 && (
              <p className="text-red-700">No sections found</p>
            )
          )}

          <ul className="flex flex-col w-[25%] ">
            {sections.map((section, index) => (
              <li
                key={section._id}
                className="mb-4 py-2 px-3.5 text-[#65FA9E] flex justify-between bg-gray-900 border border-[#65FA9E] w-auto rounded-3xl "
              >
                {section.name}
                <div>
                  <button
                    className="ml-4  text-blue-500"
                    onClick={() => handleEditSection(index)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="ml-2 text-red-700"
                    onClick={() => handleDeleteSection(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default CreateSection;
