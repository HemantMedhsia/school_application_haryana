import React from 'react'
import StudentTimeTable from '../../components/StudentDashBoard/StudentTimeTable'

const TeacherDashboard = () => {



  return (
    <div className='flex justify-between w-full gap-6'>
      <div className="w-[300px] p-2 mt-4 bg-[#283046] flex flex-col  items-center rounded-lg shadow-md">
          <StudentTimeTable />
        </div>
    </div>
  )
}

export default TeacherDashboard
