import React, { useEffect, useState } from "react";
import FormSection from "../components/Form/FormSection";
import Input from "../components/Form/Input";
import Select from "../components/Form/Select";
import FormButton from "../components/Form/FormButton";
import { getAPI } from "../utility/api/apiCall";

const CreateSubjectGroup = () => {
  const [formData, setFormData] = useState({
    subjectGroupName: "",
    selectedClass: "",
    selectedSection: "",
    selectedSubjects: [],
  });
  const [classSectionOptions, setClassSectionOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);

  useEffect(() => {
    const fetchClassSectionData = async () => {
      try {
        const response = await getAPI(
          "getAllClassesWithSections",
          {},
          setClassSectionOptions
        );
        setClassSectionOptions(response.data || []); // Safely set class and section options
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
        setSubjectOptions(response.data || []); // Safely set subject options
        console.log("Subject options:", response.data);
      } catch (error) {
        console.error("Error fetching subjects", error);
        setSubjectOptions([]);
      }
    };

    fetchSubjectData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // When the selected class changes, update the sections based on the selected class
    if (name === "selectedClass") {
      const selectedClass = classSectionOptions.find(
        (option) => option.id === value
      );

      if (selectedClass && selectedClass.sections) {
        setSectionOptions(selectedClass.sections); // Set the sections from the selected class
      } else {
        setSectionOptions([]); // Clear sections if no class or sections found
      }
    }

    // Ensure only valid inputs are processed
    if (value.trim() !== "") {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (e) => {
    const { checked, value } = e.target;

    setFormData((prevData) => {
      const selectedSubjects = checked
        ? [...prevData.selectedSubjects, value]
        : prevData.selectedSubjects.filter((id) => id !== value);

      // Remove any empty strings from selectedSubjects
      return {
        ...prevData,
        selectedSubjects: selectedSubjects.filter((v) => v),
      };
    });
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Form submitted with data:", formData);
  };

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
        }))} // Dynamically populate class options
      />
      <div className="mt-6 w-1/2 px-2">
        <label className="block text-lg font-medium text-[#7367F0] mb-4">
          Select Sections
        </label>
        {subjectOptions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {sectionOptions.map((subject) => (
              <div
                key={subject._id}
                className="flex items-center p-3 rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <input
                  type="checkbox"
                  name="selectedSubjects"
                  value={subject._id}
                  checked={formData.sections}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                />
                <label className="text-[#65FA9E] text-md font-medium">
                  {subject}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No subjects available</p>
        )}
      </div>

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
    </div>
  );
};

export default CreateSubjectGroup;
