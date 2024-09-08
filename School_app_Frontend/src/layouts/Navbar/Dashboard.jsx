import React from 'react';
import StudentDashboard from '../../pages/Dashboard/StudentDashboard';
import TeacherDashboard from '../../pages/Dashboard/TeacherDashboard'; 
import AdminDashboard from '../../pages/Dashboard/AdminDashboard';
import ParentDashboard from '../../pages/Dashboard/ParentDashboard'; 

const Dashboard = ({ role }) => {
  return (
    <div>
      {role === 'Student' && <StudentDashboard />}
      {role === 'Teacher' && <TeacherDashboard />}
      {role === 'Admin' && <AdminDashboard />}
      {role === 'Parent' && <ParentDashboard />}
    </div>
  );
}

export default Dashboard;
