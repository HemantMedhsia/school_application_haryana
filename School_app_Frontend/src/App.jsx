import React from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
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

const App = () => {
  const { userRole } = useAuth(); 

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<LoginPage />} />
        <Route path="/school" element={<Layout />}>
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
          <Route path="student-admission" element={<StudentAdd />} />
          <Route path="student-information" element={<StudnetInfo />} />
          <Route path="calendar" element={<EventCalendar />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />; 
};

export default App; 
