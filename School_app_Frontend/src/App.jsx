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
import StudentAdd from "./components/Form/StudentAdd.jsx";
import StudnetInfo from "./pages/StudnetInfo.jsx";

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
            path="student-admission"
            element={
              <RoleBasedAccess allowedRoles={["Admin"]}>
                {" "}
                <StudentAdd />
              </RoleBasedAccess>
            }
          />
          <Route path="student-information" element={<StudnetInfo />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
