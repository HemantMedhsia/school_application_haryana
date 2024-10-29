import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ContactCard = ({ contact, onEdit, onDelete }) => {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl text-gray-200 hover:shadow-2xl transition-shadow duration-300">
      <h3 className="text-2xl font-bold mb-4 text-indigo-400">
        Contact Information
      </h3>
      <p className="mb-2">
        <strong className="text-gray-400">Name:</strong> {contact.name}
      </p>
      <p className="mb-2">
        <strong className="text-gray-400">Post:</strong> {contact.post}
      </p>
      <p className="mb-2">
        <strong className="text-gray-400">Email:</strong> {contact.email}
      </p>
      <p className="mb-4">
        <strong className="text-gray-400">Phone Number:</strong> {contact.phone}
      </p>
      <div className="mt-4 flex justify-end space-x-4">
        {onEdit && (
          <button
            className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            onClick={onEdit}
          >
            <FaEdit className="mr-2" /> Edit
          </button>
        )}
        {onDelete && (
          <button
            className="flex items-center bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 px-4 rounded-full hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            onClick={onDelete}
          >
            <FaTrash className="mr-2" /> Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ContactCard;
