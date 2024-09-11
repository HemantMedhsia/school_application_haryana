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
import StudentAdd from "./pages/StudentAdd.jsx";
import StudnetInfo from "./pages/StudnetInfo.jsx";
import EventCalendar from "./pages/Dashboard/EventCalendar.jsx";
import Notice from "./pages/Notice.jsx";
import Profile from "./pages/Profile.jsx";
import ParentAdd from "./pages/ParentAdd.jsx";
import ParentInfo from "./pages/ParentInfo.jsx";

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
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
