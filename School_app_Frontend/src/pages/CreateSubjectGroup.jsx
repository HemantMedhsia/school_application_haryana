import React, { useState } from "react";
import FormSection from "../components/Form/FormSection";
import Input from "../components/Form/Input";
import Select from "../components/Form/Select";
import FormButton from "../components/Form/FormButton";

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
    <div>
      <FormSection title="Create Subject Group">
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
          options={options}
        />
      </FormSection>
      <div className="flex">
        <FormButton name="Add Subject Group" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateSubjectGroup;
