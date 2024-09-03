import React from "react";
import ReactDOM from "react-dom"; // Corrected casing from ReactDom to ReactDOM
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Layout from "./layouts/Layout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Testing from "./pages/Testing.jsx";

// Define the routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="login" element={<LoginPage />} />
      <Route path="testing" element={<Testing />} />
    </Route>
  )
);

// Render the application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
