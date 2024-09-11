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
import Notice from "./pages/Notice.jsx";
import Profile from "./pages/Student/Profile.jsx";
import ParentAdd from "./pages/Parent/ParentAdd.jsx";
import ParentInfo from "./pages/Parent/ParentInfo.jsx";
import ParentProfile from "./pages/Parent/ParentProfile.jsx";

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
          <Route path="parent-add/:studentId" element={<ParentAdd />} />
          <Route path="student-information" element={<StudnetInfo />} />

          <Route path="parent-information" element={<ParentInfo />} />
          <Route path="calendar" element={<EventCalendar />} />
          <Route path="create-notice" element={<Notice />} />
          <Route path="profile/:studentId" element={<Profile />} />
          <Route path="parent-profile/:parentId" element={<ParentProfile />} />
          <Route path="parent-update/:parentId" element={<ParentAdd />} />
          <Route path="parent-update/:studentId" element={<ParentAdd />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
