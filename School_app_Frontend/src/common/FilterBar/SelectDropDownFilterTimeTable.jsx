import React, { useState } from "react";
import FormButton from "../../components/Form/FormButton";

// Standard Select Dropdown Component
const SelectDropdown = ({ filter, value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e, filter)}
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
  );
};

// Standard Time Input Component
const TimeInput = ({ value, onChange, placeholder }) => (
  <div className="flex justify-center items-center border-gray-600 border p-2 rounded-md bg-gray-700">
    <label className="text-white">{placeholder}</label>
    <input
      type="time"
      value={value}
      onChange={onChange}
      className="ml-3 bg-gray-700 text-white rounded-md border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7367F0]"
      placeholder={placeholder}
    />
  </div>
);

// Main DynamicFilterBar2 Component
const DynamicFilterBar2 = ({ filters, onSubmit }) => {
  const [filterValues, setFilterValues] = useState({});

  const handleChange = (e, filter) => {
    const value = e.target.value;

    // Update filterValues state with the selected value
    setFilterValues((prevValues) => ({
      ...prevValues,
      [filter.name]: value,
    }));

    console.log(`Updated ${filter.name}:`, value); // Add this log to debug the updated values

    // Call the onChange handler if provided
    if (filter.onChange) {
      filter.onChange(value); // Trigger the specific onChange for the filter
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Final filter values on submit:", filterValues); // Log the current filter values
    onSubmit(filterValues); // Call the onSubmit with the filter values
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-6 flex-wrap p-4 mb-4 bg-[#283046] rounded-lg shadow-md"
    >
      {filters.map((filter, index) => (
        <div key={index} className="flex items-center flex-col w-fit">
          {filter.type === "select" && (
            <SelectDropdown
              filter={filter}
              value={filterValues[filter.name] || ""}
              onChange={handleChange}
            />
          )}
          {filter.type === "time" && (
            <TimeInput
              value={filterValues[filter.name] || ""}
              onChange={(e) => handleChange(e, filter)}
              placeholder={filter.placeholder}
            />
          )}
          {filter.type === "number" && (
            <input
              type="number"
              value={filterValues[filter.name] || ""}
              onChange={(e) => handleChange(e, filter)}
              className="p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7367F0]"
              placeholder={filter.placeholder}
            />
          )}
        </div>
      ))}
      <FormButton name="Submit Filters" type="submit" />
    </form>
  );
};

export default DynamicFilterBar2;
