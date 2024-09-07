import React from "react";

const FormButton = ({name}) => {
  return (
    <div className="flex justify-end mt-6">
      <button
        type="submit"
        className="bg-[#7367F0] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#4C51BF] transition duration-200 ease-in-out shadow-md"
      >
        {name}
      </button>
    </div>
  );
};

export default FormButton;
