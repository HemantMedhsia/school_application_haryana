import React from "react";

const FormButton = ({ name, onClick }) => {
  return (
    <div className="flex justify-end">
      <button
        type="submit" // Changed type from 'button' to 'submit'
        className="bg-[#7367F0] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#4C51BF] transition duration-200 ease-in-out shadow-md"
        onClick={onClick}
      >
        {name}
      </button>
    </div>
  );
};

export default FormButton;
