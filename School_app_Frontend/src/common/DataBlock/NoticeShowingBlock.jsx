import React, { useState } from "react";
import { FaTimes } from "react-icons/fa"; // Import an icon for the close button

// Helper function to get category styles
const getCategoryStyles = (category) => {
  switch (category) {
    case "Event":
      return {
        text: "text-indigo-400",
        bg: "bg-indigo-800",
        shadow: "shadow-indigo-500/50",
      };
    case "Holiday":
      return {
        text: "text-emerald-400",
        bg: "bg-emerald-800",
        shadow: "shadow-emerald-500/50",
      };
    case "Announcement":
      return {
        text: "text-amber-400",
        bg: "bg-amber-800",
        shadow: "shadow-amber-500/50",
      };
    case "General":
      return {
        text: "text-gray-400",
        bg: "bg-gray-800",
        shadow: "shadow-gray-500/50",
      };
    default:
      return {
        text: "text-gray-400",
        bg: "bg-gray-800",
        shadow: "shadow-gray-500/50",
      };
  }
};

// Helper function to sort notices by date
const sortNoticesByDate = (notices) => {
  return notices
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
};

const NoticeShowingBlock = ({ notices }) => {
  const [selectedNotice, setSelectedNotice] = useState(null); // State to hold the selected notice for the modal

  const recentNotices = sortNoticesByDate(notices);

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice); // Set the selected notice when clicked
  };

  const closeModal = () => {
    setSelectedNotice(null); // Close the modal by clearing the selected notice
  };

  return (
    <div>
      {recentNotices && recentNotices.length > 0 ? (
        <ul className="space-y-6">
          {recentNotices.map((notice) => {
            const { text, bg, shadow } = getCategoryStyles(notice.category);
            return (
              <li
                key={notice._id}
                className={`p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer hover:shadow-2xl transition-shadow duration-300 ${shadow}`}
                onClick={() => handleNoticeClick(notice)}
              >
                <div className="flex justify-between items-center">
                  <h1 className={`text-2xl font-bold ${text}`}>
                    {notice.title}
                  </h1>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${text} bg-opacity-20 ${bg}`}
                  >
                    {notice.category}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  {new Date(notice.date).toLocaleDateString()}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="no-data-message text-xl flex mt-4 justify-center text-red-500">
          No Notice Available!
        </div>
      )}

      {/* Modal for showing full notice details */}
      {selectedNotice && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative p-8 rounded-2xl shadow-2xl w-11/12 max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`text-3xl font-extrabold ${
                  getCategoryStyles(selectedNotice.category).text
                }`}
              >
                {selectedNotice.title}
              </h2>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  getCategoryStyles(selectedNotice.category).text
                } bg-opacity-20 ${
                  getCategoryStyles(selectedNotice.category).bg
                }`}
              >
                {selectedNotice.category}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {new Date(selectedNotice.date).toLocaleDateString()}
            </p>
            <div className="mt-6 text-gray-300 leading-relaxed">
              {selectedNotice.description}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-full hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeShowingBlock;
