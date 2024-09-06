import React from 'react';

const FormSection = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold mb-4 text-[#7367F0]">{title}</h3>
      <div className="flex flex-wrap -mx-2">{children}</div>
    </div>
  );
};

export default FormSection;
