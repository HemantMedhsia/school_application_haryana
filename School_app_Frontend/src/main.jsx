import React from "react";
import ReactDOM from "react-dom"; // Corrected casing from ReactDom to ReactDOM
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import Layout from "./layouts/Layout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Testing from "./pages/Testing.jsx";
import Dashboard from "./layouts/Navbar/Dashboard.jsx";
import RoleBasedAccess from "./pages/RoleBase/RoleBasedAccess.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LoginPage />} />
      <Route path="/school" element={<Layout />}>
        <Route
          path="dashboard"
          element={
            // <RoleBasedAccess allowedRoles={["admin", "student"]}>
            <Dashboard />
              // </RoleBasedAccess>
          }
        />
        <Route path="testing" element={<Testing />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
