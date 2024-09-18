import React, { useState } from 'react';
import Button from '../SearchBar/Button';
import FormButton from '../../components/Form/FormButton';

// Reusable Filter Bar Component
const DynamicFilterBar = ({ filters, onSubmit }) => {
  const [filterValues, setFilterValues] = useState({});

  // Handles filter field change
  const handleChange = (e, filterName) => {
    setFilterValues({
      ...filterValues,
      [filterName]: e.target.value,
    });
  };

  // Handles the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(filterValues);  // Passes filter values to the parent component
  };

return (
    <form onSubmit={handleSubmit} className="flex items-center gap-6 flex-wrap p-4 bg-[#283046] rounded-lg shadow-md">
        {filters.map((filter, index) => (
            <div key={index} className="flex items-center flex-col w-fit">
                <select 
                    value={filterValues[filter.name] || ''}
                    onChange={(e) => handleChange(e, filter.name)}
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
            </div>
        ))}
        <div className='flex items-center justify-center'>
            <FormButton name={"Submit"}/>
        </div>
    </form>
);
};

export default DynamicFilterBar;
