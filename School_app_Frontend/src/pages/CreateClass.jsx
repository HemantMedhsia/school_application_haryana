import React, { useEffect, useState } from "react";
import FormSection from "../components/Form/FormSection";
import Input from "../components/Form/Input";
import Select from "../components/Form/Select";
import FormButton from "../components/Form/FormButton";
import CheckboxGroup from "../components/Form/CheckboxGroup";
import { getAPI } from "../utility/api/apiCall";
import axios from "axios";

const CreateClass = ({ onCreate }) => {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [className, setClassName] = useState("");
  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await getAPI("getAllSections", {}, setOptions);
        console.log(response.data);
        setOptions(response.data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchSections();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getAPI(
          "getAllClassesWithSections",
          {},
          setClasses
        );
        console.log(response.data);
        const formattedClasses = response.data.map((classItem) => ({
          name: classItem.className,
          sections: classItem.sections,
        }));

        setClasses(formattedClasses);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

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
    if (className && selectedCheckboxes.length > 0) {
      const newClass = {
        name: className,
        sections: selectedCheckboxes,
      };

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/create-class`,
          newClass
        );
        console.log("Class created successfully:", response.data);

        setClasses([...classes, newClass]);
        setClassName("");
        setSelectedCheckboxes([]);

        if (onCreate) onCreate();
      } catch (error) {
        console.error("Error creating class:", error);
      }
    } else {
      alert("Please enter class name and select at least one section.");
    }
  };

  return (
    <div className="mt-4 flex">
      <div className="w-2/3 p-4 bg-[#283046] rounded-md">
        <FormSection title="Create Class">
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
          <FormButton name="Create Class" onClick={handleSubmit} />
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
    </div>
  );
};

export default CreateClass;
