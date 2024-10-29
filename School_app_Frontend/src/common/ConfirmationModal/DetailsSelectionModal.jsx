import React from "react";
import { IoClose } from "react-icons/io5";
import { FaUserGraduate, FaUserTie } from "react-icons/fa";

const DetailsSelectionModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50">
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200 rounded-2xl shadow-2xl w-11/12 max-w-md p-8">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 focus:outline-none"
          onClick={onClose}
        >
          <IoClose size={28} />
        </button>
        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-6 text-center">
          Select Detail Type
        </h2>
        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-6">
          <button
            onClick={() => {
              onSelect("student");
              onClose();
            }}
            className="flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
          >
            <FaUserGraduate className="mr-3" size={24} />
            Student Details
          </button>
          <button
            onClick={() => {
              onSelect("parent");
              onClose();
            }}
            className="flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
          >
            <FaUserTie className="mr-3" size={24} />
            Parent Details
          </button>
        </div>
        {/* Cancel Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-6 py-3 rounded-full shadow-lg transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsSelectionModal;
