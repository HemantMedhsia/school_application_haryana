import React, { useState } from "react";
import axios from "axios";
import LoginForm from "../components/LoginPage/LoginForm";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import PyramidLoader from "../common/Loader/PyramidLoader";
import { ToastContainer, toast } from "react-toastify";

const LoginPage = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Teacher");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

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
      case "Parent":
        apiEndpoint = `${import.meta.env.VITE_BACKEND_URL}/api/login-parent`;
        break;
      default:
        setError("Invalid role selected.");
        return;
    }

    try {
      setLoader(true);

      const response = await axios.post(
        apiEndpoint,
        { email, password, role },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      const { accessToken, refreshToken, user } = response.data.data;
      login(accessToken, refreshToken, user);

      navigate("/school/dashboard");
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
      {loader && <PyramidLoader desc={"Loading Data..."} />}{" "}
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        error={error}
        role={role}
        setRole={setRole}
        loading={loading}
      />
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
