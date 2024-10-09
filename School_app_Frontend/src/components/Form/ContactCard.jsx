import React from "react";

const ContactCard = ({ contact, onEdit, onDelete }) => {
  return (
    <div className="p-4 bg-gray-700 rounded-lg shadow-lg text-[#E0E0E0]">
      <h3 className="text-xl font-bold mb-4 text-[#7367F0]">
        Contact Information
      </h3>
      <p>
        <strong>Name:</strong> {contact.name}
      </p>
      <p>
        <strong>Post:</strong> {contact.post}
      </p>
      <p>
        <strong>Email:</strong> {contact.email}
      </p>
      <p>
        <strong>Phone Number:</strong> {contact.phone}
      </p>
      <div className="mt-4 flex justify-between">
        {onEdit && (
          <button
            className="bg-[#7367F0] hover:bg-[#5e58e5] text-white py-1 px-3 rounded"
            onClick={onEdit}
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
            onClick={onDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ContactCard;
