import React from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  Navigate,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "./layouts/Layout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Testing from "./pages/Testing.jsx";
import Dashboard from "./layouts/Navbar/Dashboard.jsx";
import RoleBasedAccess from "./pages/RoleBase/RoleBasedAccess.jsx";
import { useAuth } from "./context/AuthProvider.jsx";
import StudentAdd from "./pages/Student/StudentAdd.jsx";
import StudnetInfo from "./pages/Student/StudnetInfo.jsx";
import EventCalendar from "./pages/Dashboard/EventCalendar.jsx";
import Notice from "./pages/Notice/Notice.jsx";
import Profile from "./pages/Student/Profile.jsx";
import ParentAdd from "./pages/Parent/ParentAdd.jsx";
import ParentInfo from "./pages/Parent/ParentInfo.jsx";
import Attendence from "./pages/Attendence.jsx";
import ParentProfile from "./pages/Parent/ParentProfile.jsx";
import TeacherInfo from "./pages/Teacher/TeacherInfo.jsx";
import TeacherProfile from "./pages/Teacher/TeacherProfile.jsx";
import TeacherAdd from "./pages/Teacher/TeacherAdd.jsx";
import AddMarks from "./pages/AddMarks.jsx";
import CreateSection from "./pages/CreateSection.jsx";
import CreateClass from "./pages/CreateClass.jsx";
import AddSubjects from "./pages/AddSubjects.jsx";
import CreateSubjectGroup from "./pages/CreateSubjectGroup.jsx";
import ViewNotice from "./pages/Notice/ViewNotice.jsx";

const App = () => {
  const { userRole, authToken } = useAuth();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/school"
          element={authToken ? <Layout /> : <Navigate to="/" />}
        >
          <Route
            path="dashboard"
            element={
              // Uncomment to use RoleBasedAccess
              // <RoleBasedAccess allowedRoles={["admin", "student"]}>
              <Dashboard role={userRole} />
              // </RoleBasedAccess>
            }
          />
          <Route path="testing" element={<Testing />} />

          <Route
            path="student-admission/:studentId?"
            element={
              <RoleBasedAccess allowedRoles={["Admin", "Student"]}>
                {" "}
                <StudentAdd />
              </RoleBasedAccess>
            }
          />
          <Route path="parent-add/:Id" element={<ParentAdd />} />
          <Route path="student-information" element={<StudnetInfo />} />

          <Route path="parent-information" element={<ParentInfo />} />
          <Route path="calendar" element={<EventCalendar />} />
          <Route path="create-notice" element={<Notice />} />
          <Route path="profile/:studentId" element={<Profile />} />
          <Route path="attendance" element={<Attendence />} />
          <Route path="all-teachers" element={<TeacherInfo />} />
          <Route path="parent-profile/:parentId" element={<ParentProfile />} />
          <Route path="parent-update/:parentId" element={<ParentAdd />} />
          <Route
            path="parent-update-student/:studentId"
            element={<ParentAdd />}
          />
          <Route
            path="teacher-profile/:teacherId"
            element={<TeacherProfile />}
          />
          <Route path="teacher-update/:teacherId" element={<TeacherAdd />} />
          <Route path="teacher-add" element={<TeacherAdd />} />
          <Route path="add-marks" element={<AddMarks />} />
          <Route path="create-section" element={<CreateSection />} />
          <Route path="create-class" element={<CreateClass />} />
          <Route path="add-subjects" element={<AddSubjects />} />
          <Route path="create-subject-group" element={<CreateSubjectGroup />} />
          <Route path="view-notice" element={<ViewNotice />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
