import React, { useState } from "react";
import axios from "axios";
import LoginForm from "../components/LoginPage/LoginForm";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [teacherLoginPassword, setTeacherLoginPassword] = useState("");
  const [role, setRole] = useState("Teacher"); // Default role
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting to log in with:", { email, teacherLoginPassword, role });
    try {
      const response = await axios.post(
        "https://school-application-three.vercel.app/api/login-teacher",
        {
          email,
          teacherLoginPassword,
          role, // Include role in the login request
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login successful:", response.data);

      const { accessToken, refreshToken } = response.data.data;
      console.log("Access token:", accessToken);
      console.log("Refresh token:", refreshToken);

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    } catch (err) {
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        console.error("Error response headers:", err.response.headers);
        setError(
          err.response.data.message ||
            "Login failed. Please check your credentials and try again."
        );
      } else if (err.request) {
        console.error("Error request data:", err.request);
        setError("No response received from the server. Please try again later.");
      } else {
        console.error("Error message:", err.message);
        setError("An error occurred. Please try again.");
      }
      console.error("Error config:", err.config);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <LoginForm
        email={email}
        setEmail={setEmail}
        teacherLoginPassword={teacherLoginPassword}
        setTeacherLoginPassword={setTeacherLoginPassword}
        handleLogin={handleLogin}
        error={error}
        role={role} // Pass the role to LoginForm
        setRole={setRole} // Pass the setRole function to LoginForm
      />
    </div>
  );
};

export default LoginPage;
