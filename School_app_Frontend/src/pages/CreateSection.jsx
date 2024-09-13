import React, { useState } from "react";
import Input from "../components/Form/Input";
import FormButton from "../components/Form/FormButton";

const CreateSection = () => {
  const [sectionName, setSectionName] = useState("");
  const [sections, setSections] = useState([]);

  const handleAddSection = (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    if (sectionName.trim() !== "") {
      // Add the new section to the list
      setSections([...sections, { name: sectionName }]);
      setSectionName(""); // Reset input field
    } else {
      console.log("Section name is empty");
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
          <FormButton name="Create Section" />
        </form>
      </div>

      {/* Right Side: Display Sections */}
      <div className="w-1/2 mt-8 ml-4">
        <div className="w-full bg-gray-900 text-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-[#7367F0] mb-6">
            Sections
          </h2>
          <ul className="flex flex-col w-10">
            {sections.map((section, index) => (
              <li key={index} className="mb-4 py-2 px-3.5 bg-[#7367F5] border w-auto rounded-3xl inline-block">
                {section.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateSection;
