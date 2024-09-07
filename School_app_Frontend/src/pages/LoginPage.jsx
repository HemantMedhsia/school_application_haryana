import React, { useState } from "react";
import axios from "axios";
import LoginForm from "../components/LoginPage/LoginForm";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import PyramidLoader from "../common/Loader/PyramidLoader";

const LoginPage = () => {
  const { login, loading } = useAuth(); // Use login and loading from context
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Teacher");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false); // State to manage loader

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting to log in with:", { email, password, role });

    let apiEndpoint;
    switch (role) {
      case "Teacher":
        apiEndpoint = `${import.meta.env.VITE_BACKEND_URL}/api/login-teacher`;
        break;
      case "Student":
        apiEndpoint = `${import.meta.env.VITE_BACKEND_URL}/api/login-student`;
        break;
      case "Admin":
        apiEndpoint = `${import.meta.env.VITE_BACKEND_URL}/api/login-admin`;
        break;
      case "Staff":
        apiEndpoint = `${import.meta.env.VITE_BACKEND_URL}/api/login-staff`;
        break;
      default:
        setError("Invalid role selected.");
        return;
    }

    try {
      setLoader(true); // Set loader before making the API call

      const response = await axios.post(
        apiEndpoint,
        { email, password, role },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Login successful:", response.data);
      const { accessToken, refreshToken } = response.data.data;
      login(accessToken, refreshToken);

      navigate("/school/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoader(false); // Reset loader regardless of success or failure
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
      {loader && <PyramidLoader desc={"Loading Data..."}/>} {/* Loader will be displayed while loader is true */}
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        error={error}
        role={role}
        setRole={setRole}
        loading={loading} // Pass loading to the LoginForm
      />
    </div>
  );
};

export default LoginPage;
