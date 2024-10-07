import React from "react";
import StudentDashboard from "../../pages/Dashboard/StudentDashboard";
import TeacherDashboard from "../../pages/Dashboard/TeacherDashboard";
import AdminDashboard from "../../pages/Dashboard/AdminDashboard";

const Dashboard = ({ role }) => {
  return (
    <div>
      {role === "Student" && <StudentDashboard />}
      {role === "Teacher" && <TeacherDashboard />}
      {role === "Admin" && <AdminDashboard />}
      {role === "Parent" && <StudentDashboard />}
    </div>
  );
};

export default Dashboard;
