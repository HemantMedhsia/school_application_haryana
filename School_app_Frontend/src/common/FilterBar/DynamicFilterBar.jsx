import React, { useState } from "react";
import FormButton from "../../components/Form/FormButton";

// Custom Dropdown with Checkbox Group Component
const CheckboxGroupDropdown = ({ filter, selectedValues, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle dropdown open/close
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-full">
      <div
        className="p-3 bg-gray-700 text-white rounded-md border border-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7367F0]"
        onClick={toggleDropdown}
      >
        {selectedValues.length > 0
          ? selectedValues.join(", ")
          : filter.placeholder}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full flex flex-col items-start mt-1 bg-gray-800 rounded-md shadow-lg p-3 max-h-56 overflow-y-auto">
          {filter.options.map((option, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                type="checkbox"
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={(e) => onChange(e, filter.name)}
                className="form-checkbox h-4 w-4 text-[#7367F0] border-gray-600 bg-gray-700 rounded focus:ring-[#7367F0]"
              />
              <label className="ml-2 text-white">{option.label}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DynamicFilterBar = ({ filters, onSubmit }) => {
  const [filterValues, setFilterValues] = useState({});

  const handleChange = (e, filter) => {
    const value = e.target.value;
    setFilterValues({
      ...filterValues,
      [filter.name]: value,
    });

    // Call the onChange function if it exists for the filter
    if (filter.onChange) {
      filter.onChange(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(filterValues);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-6 flex-wrap p-4 bg-[#283046] rounded-lg shadow-md"
    >
      {filters.map((filter, index) => (
        <div key={index} className="flex items-center flex-col w-fit">
          {filter.type === "select" ? (
            <select
              value={filterValues[filter.name] || ""}
              onChange={(e) => handleChange(e, filter)} // Pass the filter object along with the event
              className="p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7367F0]"
              required={filter.required}
            >
              <option value="">{filter.placeholder}</option>
              {filter.options.map((option, idx) => (
                <option key={idx} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      ))}

      <div className="flex items-center justify-center">
        <FormButton name="Submit" />
      </div>

      
    </form>
  );
};

export default DynamicFilterBar;
