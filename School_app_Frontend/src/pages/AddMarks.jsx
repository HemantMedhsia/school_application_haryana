import React from 'react'

const AddMarks = () => {
  return (
    <div>
        <h1>Add Marks</h1>
        <div className="flex flex-col w-full mt-8">
          <div className="w-full bg-gray-900 text-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-[#7367F0] mb-6">Add Marks</h2>
            <form className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div className="flex-1">
                  <label htmlFor="studentName" className="text-sm">Student Name</label>
                  <input type="text" id="studentName" className="w-full p-2 bg-gray-800 rounded-lg text-gray-100 mt-1" />
                </div>
                <div className="flex-1">
                  <label htmlFor="studentRoll" className="text-sm">Student Roll</label>
                  <input type="text" id="studentRoll" className="w-full p-2 bg-gray-800 rounded-lg text-gray-100 mt-1" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div className="flex-1">
                  <label htmlFor="subject" className="text-sm">Subject</label>
                  <input type="text" id="subject" className="w-full p-2 bg-gray-800 rounded-lg text-gray-100 mt-1" />
                </div>
                <div className="flex-1">
                  <label htmlFor="marks" className="text-sm">Marks</label>
                  <input type="text" id="marks" className="w-full p-2 bg-gray-800 rounded-lg text-gray-100 mt-1" />
                </div>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white p-2 rounded-lg shadow-md hover:from-green-600 hover:to-blue-700 transition">Add Marks</button>
            </form>
          </div>
        </div>
    </div>
  )
}

export default AddMarks