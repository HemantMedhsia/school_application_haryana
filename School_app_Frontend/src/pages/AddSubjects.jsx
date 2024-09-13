import React, { useState } from 'react';

const AddSubjects = () => {
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjects, setSubjects] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubjects([...subjects, { name: subjectName, code: subjectCode }]);
    setSubjectName('');
    setSubjectCode('');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#283046] rounded-md p-8">
      <div className="flex-1">
        <div className="w-full bg-gray-900 text-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-[#7367F0] mb-6">Add New Subject</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="subjectName" className="block text-lg font-medium">
                Subject Name
              </label>
              <input
                type="text"
                id="subjectName"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full p-2 bg-gray-800 rounded-lg text-gray-100 mt-1"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="subjectCode" className="block text-lg font-medium">
                Subject Code
              </label>
              <input
                type="text"
                id="subjectCode"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="w-full p-2 bg-gray-800 rounded-lg text-gray-100 mt-1"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white p-2 rounded-lg shadow-md hover:from-green-600 hover:to-blue-700 transition"
            >
              Add Subjects
            </button>
          </form>
        </div>
      </div>
      {/* Display Added Subjects */}
      <div className="flex-1 ml-8 mt-8">
        <div className="w-full text-gray-100 p-4 rounded-lg ">
          <h2 className="text-2xl font-semibold text-[#7367F0] mb-6">Subjects List</h2>
          <div className="h-96 overflow-y-scroll">
            <ul className="space-y-4">
              {subjects.map((subject, index) => (
                <li key={index} className="bg-gray-900 p-2 rounded-lg shadow-lg">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-lg font-bold"><strong>Name:</strong> {subject.name}</p>
                    <p className="text-lg"><strong>Code:</strong> {subject.code}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubjects;