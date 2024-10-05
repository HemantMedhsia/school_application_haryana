import React, { useEffect, useState } from "react";
import FormSection from "../components/Form/FormSection";
import Input from "../components/Form/Input";
import Select from "../components/Form/Select";
import FormButton from "../components/Form/FormButton";
import { getAPI } from "../utility/api/apiCall";
import { toast, ToastContainer } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const CreateSubjectGroup = () => {
  const [formData, setFormData] = useState({
    subjectGroupName: "",
    selectedClass: "",
    selectedSection: [],
    selectedSubjects: [],
  });
  const [classSectionOptions, setClassSectionOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [data, setData] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);

  useEffect(() => {
    const fetchClassSectionData = async () => {
      try {
        const response = await getAPI(
          "getAllClassesWithSections",
          {},
          setClassSectionOptions
        );
        console.log("Class and section options:", response.data);
        setClassSectionOptions(response.data || []);
        console.log("Class and section options:", response.data);
      } catch (error) {
        console.error("Error fetching class and section data", error);
      }
    };

    fetchClassSectionData();
  }, []);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const response = await getAPI("getAllSubjects", {}, setSubjectOptions);
        setSubjectOptions(response.data || []);
        console.log("Subject options:", response.data);
      } catch (error) {
        console.error("Error fetching subjects", error);
        setSubjectOptions([]);
      }
    };

    fetchSubjectData();
  }, []);

  useEffect(() => {
    const fetchSujectGroup = async () => {
      try {
        const response = await getAPI("getSubjectGroup", {}, setData);
        setData(response.data || []);
        console.log("Subject group:", response.data);
      } catch (error) {
        console.error("Error fetching subjects group", error);
        setData([]);
      }
    };

    fetchSujectGroup();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "selectedClass") {
      const selectedClass = classSectionOptions.find(
        (option) => option.id === value
      );

      if (selectedClass && selectedClass.sections) {
        setSectionOptions(selectedClass.sections);
      } else {
        setSectionOptions([]);
      }
    }

    setFormData({ ...formData, [name]: value.trim() });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked, value } = e.target;

    setFormData((prevData) => {
      if (name === "selectedSubjects") {
        const updatedSubjects = checked
          ? [...prevData.selectedSubjects, value]
          : prevData.selectedSubjects.filter((id) => id !== value);

        return {
          ...prevData,
          selectedSubjects: updatedSubjects,
        };
      } else if (name === "selectedSections") {
        const updatedSections = checked
          ? [...prevData.selectedSection, value]
          : prevData.selectedSection.filter((id) => id !== value);

        return {
          ...prevData,
          selectedSection: updatedSections,
        };
      }
      return prevData;
    });
  };

  const handleSubmit = async () => {
    const subjectGroupData = {
      name: formData.subjectGroupName,
      classId: formData.selectedClass,
      sectionIds: formData.selectedSection,
      subjectIds: formData.selectedSubjects,
    };

    if (
      !subjectGroupData.name ||
      !subjectGroupData.classId ||
      subjectGroupData.sectionIds.length === 0 ||
      subjectGroupData.subjectIds.length === 0
    ) {
      toast.error("All fields are required.");
      return;
    }

    try {
      if (editingGroup) {
        console.log("subjectGroupData:", subjectGroupData);
        await axios.put(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/update-subject-group/${editingGroup}`,
          subjectGroupData
        );
        toast.success("Subject Group updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/create-subject-group`,
          subjectGroupData
        );
        toast.success("Subject Group added successfully!");
      }

      const response = await getAPI("getSubjectGroup", {}, setData);
      setData(response.data || []);
      setFormData({
        subjectGroupName: "",
        selectedClass: "",
        selectedSection: [],
        selectedSubjects: [],
      });
    } catch (error) {
      console.error(
        "Error adding subject group:",
        error.response?.data || error.message
      );
      toast.error(
        "Error adding subject group: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleEdit = (group) => {
    setEditingGroup(group._id);
    console.log("Editing group:", group);

    console.log("classSectionOptions:", classSectionOptions);
    const selectedClass = classSectionOptions.find(
      (option) => option.id === group.classes[0]._id
    );
    console.log("Selected class:", selectedClass);

    if (selectedClass && selectedClass.sections) {
      setSectionOptions(selectedClass.sections);
    } else {
      setSectionOptions([]);
    }

    setFormData({
      subjectGroupName: group.name,
      selectedClass: group.classes[0]._id,
      selectedSection: Array.isArray(group.sections)
        ? group.sections.map((section) => section._id)
        : [],
      selectedSubjects: Array.isArray(group.subjects)
        ? group.subjects.map((subject) => subject._id)
        : [],
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject group?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/delete-subject-group/${id}`
        );
        toast.success("Subject Group deleted successfully!");

        setData((prevData) => prevData.filter((group) => group._id !== id));
      } catch (error) {
        console.error("Error deleting subject group:", error);
        toast.error(
          "Error deleting subject group: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  console.log("Form data:", formData);
  return (
    <div className="mt-8">
      <Input
        labelName="Subject Group Name"
        placeholder="Enter Subject Group Name"
        name="subjectGroupName"
        value={formData.subjectGroupName}
        onChange={handleInputChange}
      />
      <Select
        labelName="Select Class"
        name="selectedClass"
        value={formData.selectedClass}
        onChange={handleInputChange}
        options={classSectionOptions.map((option) => ({
          id: option.id,
          name: option.className,
        }))}
      />
      {sectionOptions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {sectionOptions.map((section) => (
            <div
              key={section.id}
              className="flex items-center p-3 rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <input
                type="checkbox"
                name="selectedSections"
                value={section.id}
                checked={formData.selectedSection.includes(section.id)}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
              />
              <label className="text-[#65FA9E] text-md font-medium">
                {section.name}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No sections available</p>
      )}

      <div className="mt-6 w-1/2 px-2">
        <label className="block text-lg font-medium text-[#7367F0] mb-4">
          Select Subjects
        </label>
        {subjectOptions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {subjectOptions.map((subject) => (
              <div
                key={subject._id}
                className="flex items-center p-3 rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <input
                  type="checkbox"
                  name="selectedSubjects"
                  value={subject._id}
                  checked={formData.selectedSubjects.includes(subject._id)}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                />
                <label className="text-[#65FA9E] text-md font-medium">
                  {subject.name}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No subjects available</p>
        )}
      </div>
      <div className="flex mt-6">
        <FormButton name="Save" onClick={handleSubmit} />
      </div>

      <div className="relative flex pt-6 mt-6 flex-col min-w-0 break-words w-full pb-6 shadow-lg rounded bg-[#283046]">
        <div className="overflow-x-auto">
          <table className="items-center w-full bg-[#283046] border-collapse text-white">
            <thead>
              <tr>
                <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">
                  Subject Group Name
                </th>
                <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">
                  Class (Section)
                </th>
                <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">
                  Subject
                </th>
                <th className="px-6 bg-[#2d3748] text-white align-middle border-b border-gray-700 py-3 text-s uppercase font-semibold text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((group) => (
                <tr key={group._id} className="hover:bg-gray-900 duration-300">
                  {/* Name Column */}
                  <td className="border-t-0 px-6 align-middle text-md whitespace-nowrap p-4 text-left">
                    {group.name}
                  </td>

                  {/* Class (Section) Column */}
                  <td className="border-t-0 px-6 align-middle text-md whitespace-nowrap p-4 text-left">
                    {group.classes && group.classes.length > 0 ? (
                      group.classes.map((cls, index) => (
                        <div key={cls._id} className="my-2">
                          <span className="text-xl">{cls.name}</span>
                          {group.sections && group.sections.length > 0 ? (
                            group.sections
                              .filter((section) =>
                                section.classIds.includes(cls._id)
                              )
                              .map((section) => (
                                <p
                                  key={section._id}
                                  className="text-sm text-gray-400"
                                >
                                  Section: {section.name}
                                </p>
                              ))
                          ) : (
                            <p className="text-sm text-gray-500">No Sections</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No Classes</p>
                    )}
                  </td>

                  {/* Subject Column */}
                  <td className="border-t-0 px-6 align-middle text-md whitespace-nowrap p-4 text-left">
                    {group.subjects && group.subjects.length > 0 ? (
                      <div className="text-sm">
                        {group.subjects.map((subject) => (
                          <p key={subject._id} className="py-1">
                            {subject.name}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No Subjects</p>
                    )}
                  </td>

                  {/* Action Column */}
                  <td className="border-t-0 px-6 py-4 text-left">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition-all mr-4"
                      onClick={() => handleEdit(group)}
                    >
                      <FaEdit className="inline-block text-lg" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition-all"
                      onClick={() => handleDelete(group._id)}
                    >
                      <FaTrash className="inline-block text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default CreateSubjectGroup;
