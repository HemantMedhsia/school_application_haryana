import React from 'react';

// Sample homework data
const homeworkList = [
  {
    subject: 'Mathematics',
    teacher: 'Mr. Smith',
    dueDate: '2024-09-15',
    description: 'Complete exercises 5 to 10 on page 23.',
  },
  {
    subject: 'English',
    teacher: 'Ms. Johnson',
    dueDate: '2024-09-16',
    description: 'Read and summarize chapter 4 of the textbook.',
  },
  {
    subject: 'Physics',
    teacher: 'Mr. Brown',
    dueDate: '2024-09-17',
    description: 'Prepare a presentation on Newton’s Laws of Motion.',
  },
];

const DisplayingStudentHomework = () => {
  return (
    <div className="w-full mx-auto p-6 shadow-md rounded-lg bg-gray-900 text-gray-100">
      <h1 className="text-2xl font-bold text-center text-[#7367F0] mb-6">Student Homework</h1>
      <ul className="space-y-4">
        {homeworkList.map((homework, index) => (
          <li
            key={index}
            className="p-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg shadow hover:from-green-600 hover:to-blue-700 transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{homework.subject}</h2>
                <p className="text-sm text-gray-200">Teacher: {homework.teacher}</p>
                <p className="text-sm text-gray-200">Due Date: {homework.dueDate}</p>
              </div>
            </div>
            <p className="mt-2">{homework.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayingStudentHomework;
