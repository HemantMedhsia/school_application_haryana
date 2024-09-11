import React, { useState, useMemo } from 'react';

// Helper function to get category styles
const getCategoryStyles = (category) => {
  switch (category) {
    case 'Behavior':
      return {
        text: 'text-purple-400',
        bg: 'bg-[#5B21B6]',
        shadow: 'shadow-purple-400/50',
      };
    case 'Homework':
      return {
        text: 'text-red-400',
        bg: 'bg-[#B91C1C]',
        shadow: 'shadow-red-400/50',
      };
    case 'Attendance':
      return {
        text: 'text-blue-400',
        bg: 'bg-[#1E3A8A]',
        shadow: 'shadow-blue-400/50',
      };
    default:
      return {
        text: 'text-gray-400',
        bg: 'bg-[#374151]',
        shadow: 'shadow-gray-400/50',
      };
  }
};

// Helper function to get status styles
const getStatusStyles = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-500 text-yellow-100';
    case 'Resolved':
      return 'bg-green-500 text-green-100';
    case 'In Progress':
      return 'bg-blue-500 text-blue-100';
    default:
      return 'bg-gray-500 text-gray-100';
  }
};

const ComplaintShowingBlock = ({ complaints }) => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Handle complaint click to show details in a modal
  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
  };

  // Close modal
  const closeModal = () => {
    setSelectedComplaint(null);
  };

  return (
    <div className="">
      {complaints && complaints.length > 0 ? (
        <ul className="space-y-4">
          {complaints.map((complaint) => {
            const { text, shadow } = getCategoryStyles(complaint.category);
            return (
              <li
                key={complaint.id}
                className={`p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 ${shadow}`}
                onClick={() => handleComplaintClick(complaint)}
              >
                <div className="flex justify-between items-center">
                  <h1 className={`text-xl font-semibold ${text}`}>{complaint.category}</h1>
                  <span
                    className={`px-2 py-1 text-sm font-bold rounded ${getStatusStyles(complaint.status)}`}
                  >
                    {complaint.status}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No complaints available.</p>
      )}

      {/* Modal for showing full complaint details */}
      {selectedComplaint && (
        <div
          className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <div
            className={`p-6 rounded-lg shadow-lg w-11/12 max-w-md bg-gray-800 text-gray-200`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2">
              <h2
                id="modal-title"
                className={`text-2xl font-bold ${getCategoryStyles(selectedComplaint.category).text}`}
              >
                {selectedComplaint.category}
              </h2>
              <span
                className={`px-2 py-1 text-sm font-bold rounded ${getStatusStyles(
                  selectedComplaint.status
                )}`}
              >
                {selectedComplaint.status}
              </span>
            </div>
            <p className="mt-4 text-gray-300">{selectedComplaint.description}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintShowingBlock;
