import React, { useState, useRef, useEffect } from "react";

const SearchableSelect = ({
  labelName,
  name,
  value="",
  onChange,
  options,
  placeholder = "Select",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Sync searchTerm with external value prop
  useEffect(() => {
    const selectedOption = options.find(option => option.id === value);
    setSearchTerm(selectedOption ? selectedOption.name : ""); // Update searchTerm based on value prop
  }, [value, options]);

  // Filter options based on search term
  const filteredOptions = options?.filter((option) =>
    option?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle input change
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  // Handle option select
  const handleSelect = (option) => {
    onChange({
      target: {
        name,
        value: option.id,
      },
    });
    setSearchTerm(option?.name || ""); // Set search term to selected option name
    setShowDropdown(false); // Close the dropdown
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <span
      className="flex flex-col w-full md:w-1/3 px-2 mb-4 relative"
      ref={dropdownRef}
    >
      <label className="text-sm font-medium leading-none text-gray-400">
        {labelName}
      </label>
      <input
        type="text"
        name={name}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        placeholder={`${placeholder} ${labelName}`}
        className="bg-[#283046] text-sm text-[#FFFFFF] mt-2 w-full h-9 rounded-[5px] border-2 border-[#39424E] focus:border-[#6B46C1] outline-none px-2"
      />
      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-[#283046] border border-[#39424E] rounded-md shadow-lg max-h-40 overflow-y-auto">
          {filteredOptions?.length > 0 ? (
            filteredOptions?.map((option) => (
              <div
                key={option.id}
                className="px-2 py-1 hover:bg-[#6B46C1] cursor-pointer"
                onClick={() => handleSelect(option)}
              >
                {option?.name}
              </div>
            ))
          ) : (
            <div className="px-2 py-1 text-gray-500">No options found</div>
          )}
        </div>
      )}
    </span>
  );
};

export default SearchableSelect;
