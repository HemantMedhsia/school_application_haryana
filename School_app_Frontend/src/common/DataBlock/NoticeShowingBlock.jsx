import React, { useState } from "react";

// Helper function to get category styles
const getCategoryStyles = (category) => {
  switch (category) {
    case "Event":
      return {
        text: "text-blue-400",
        bg: "bg-[#1E3A8A]",
        shadow: "shadow-blue-400/50",
      };
    case "Holiday":
      return {
        text: "text-green-400",
        bg: "bg-[#064E3B]",
        shadow: "shadow-green-400/50",
      };
    case "Announcement":
      return {
        text: "text-yellow-400",
        bg: "bg-[#B45309]",
        shadow: "shadow-yellow-400/50",
      };
    case "General":
      return {
        text: "text-gray-400",
        bg: "bg-[#374151]",
        shadow: "shadow-gray-400/50",
      };
    default:
      return {
        text: "text-gray-400",
        bg: "bg-[#374151]",
        shadow: "shadow-gray-400/50",
      };
  }
};

// Helper function to parse date from dd-mm-yyyy to yyyy-mm-dd
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return new Date(`${year}-${month}-${day}`);
};

// Helper function to sort notices by date
const sortNoticesByDate = (notices) => {
  return notices
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 2);
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
    <div className="">
      {recentNotices && recentNotices.length > 0 ? (
        <ul className="space-y-4">
          {recentNotices.map((notice) => {
            const { text, bg, shadow } = getCategoryStyles(notice.category);
            return (
              <li
                key={notice._id}
                className={`p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 ${shadow}`}
                onClick={() => handleNoticeClick(notice)}
              >
                <div className="flex justify-between items-center">
                  <h1 className={`text-xl font-semibold ${text}`}>
                    {notice.title}
                  </h1>
                  <span
                    className={`px-2 py-1 text-sm font-bold rounded ${text} bg-opacity-20`}
                  >
                    {notice.category}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-400">
                  {new Date(notice.date).toLocaleDateString()}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="no-data-message text-xl flex mt-4 justify-center text-red-500">
          No Notice Available !
        </div>
      )}

      {/* Modal for showing full notice details */}
      {selectedNotice && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-white bg-opacity-10">
          <div
            className={`p-6 rounded-lg shadow-lg w-11/12 max-w-md bg-gray-800 text-gray-200`}
          >
            <div className="flex justify-between items-center mb-2">
              <h2
                className={`text-2xl font-bold ${
                  getCategoryStyles(selectedNotice.category).text
                }`}
              >
                {selectedNotice.title}
              </h2>
              <span
                className={`px-2 py-1 text-sm font-bold rounded ${
                  getCategoryStyles(selectedNotice.category).text
                } bg-opacity-20`}
              >
                {selectedNotice.category}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {new Date(selectedNotice.date).toLocaleDateString()}
            </p>
            <p className="mt-4 text-gray-300">{selectedNotice.description}</p>
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

export default NoticeShowingBlock;
