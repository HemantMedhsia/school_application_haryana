import React, { useEffect, useState } from "react";
import FormSection from "../components/Form/FormSection";
import Input from "../components/Form/Input";
import Select from "../components/Form/Select";
import FormButton from "../components/Form/FormButton";
import { getAPI } from "../utility/api/apiCall";

const options = [
  { id: "1", name: "A" },
  { id: "2", name: "B" },
  { id: "3", name: "C" },
  { id: "4", name: "D" },
];

const CreateSubjectGroup = () => {
  const [formData, setFormData] = useState({
    subjectGroupName: "",
    selectedClass: "",
    selectedSection: "",
    selectedSubject: "",
  });
  const [classSectionOptions, setClassSectionOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);

  useEffect(() => {
    const fetchClassSectionData = async () => {
      try {
        const response = await getAPI("getAllClassesWithSections", {}, setClassSectionOptions);
        setClassSectionOptions(response.data);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Form submitted with data:", formData);
  };

  return (
    <div className="mt-8">
      {/* <FormSection title="Create Subject Group"> */}
      <div>
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
          options={options}
        />
        <Select
          labelName="Select Section"
          name="selectedSection"
          value={formData.selectedSection}
          onChange={handleInputChange}
          options={options}
        />
        <Select
          labelName="Select Subject"
          name="selectedSubject"
          value={formData.selectedSubject}
          onChange={handleInputChange}
          options={
            subjectOptions.length > 0
              ? subjectOptions.map((opt) => ({
                  id: opt._id,
                  name: opt.name,
                }))
              : []
          }
        />
        {/* </FormSection> */}
      </div>
      <div className="flex">
        <FormButton name="Save" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateSubjectGroup;
