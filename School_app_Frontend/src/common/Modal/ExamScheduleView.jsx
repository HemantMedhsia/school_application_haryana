


import React from "react";
import moment from "moment"; // To format the exam date

const Modal = ({ isOpen, onClose, examDetails }) => {
  if (!isOpen) return null;

  const { examType, examDetails: subjects } = examDetails;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70  z-10 flex justify-center items-center">
      <div className="p-6 bg-[#283046]  shadow-[#65FA9E] shadow-md rounded-lg w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-[#7367F0] mb-4">
          Exam Details for {examType}
        </h2>

        {/* Block Table Structure */}
        <div className="grid grid-cols-4 gap-4 text-[#65FA9E] text-left font-medium mb-2">
          <div>Subject</div>
          <div>Exam Date</div>
          <div>Start Time</div>
          <div>End Time</div>
        </div>

        <div className="divide-y divide-[#65FA9E]">
          {subjects?.map((subject, index) => (
            <div key={subject._id} className="grid grid-cols-4 gap-4 py-3">
              <div>{subject.subject}</div>
              <div className="text-red-600 font-semibold">{moment(subject.examDate).format("YYYY-MM-DD")}</div>
              <div className="text-red-600 font-semibold">{subject.startTime}</div>
              <div >{subject.endTime}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 bg-[#7367F0] text-white py-2 px-6 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
