import React from "react";

const DetailsSelectionModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded shadow-lg">
        <h2 className="text-lg font-semibold">Select Detail Type</h2>
        <div className="mt-4 flex gap-6 justify-around">
          <button
            onClick={() => {
              onSelect("student");
              onClose();
            }}
            className="bg-blue-300  text-white px-4 py-2 rounded"
          >
            Student Details
          </button>
          <button
            onClick={() => {
              onSelect("parent");
              onClose();
            }}
            className="bg-green-400 text-white px-4 py-2 rounded"
          >
            Parent Details
          </button>
        </div>
        <button onClick={onClose} className="mt-4 text-red-500">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DetailsSelectionModal;
