// ConfirmationModal.jsx
import React from "react";
import { IoClose } from "react-icons/io5";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl shadow-2xl w-11/12 md:w-1/2 lg:w-1/3 p-8 animate-fade-in-up">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 focus:outline-none"
          onClick={onClose}
        >
          <IoClose size={28} />
        </button>
        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-6 text-center">
          {title || "Confirmation"}
        </h2>
        {/* Message */}
        <p className="text-lg mb-8 text-center">
          {message || "Are you sure you want to proceed?"}
        </p>
        {/* Buttons */}
        <div className="flex justify-center space-x-6">
          <button
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full shadow-lg transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full shadow-lg transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
