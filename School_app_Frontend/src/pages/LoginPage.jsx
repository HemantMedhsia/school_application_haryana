import React, { useEffect, useState } from "react";
import axios from "axios";
import LoginForm from "../components/LoginPage/LoginForm";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [teacherLoginPassword, setTeacherLoginPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("teacher");
  const [schoolName, setSchoolName] = useState("Demo School");

  useEffect(() => {
    // Extract subdomain
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0]; // Gets the part before the first dot
    console.log("Subdomain:", hostname);

    // Set school name based on subdomain
    if (subdomain !== 'localhost') {
      setSchoolName(hostname); // Set school name from subdomain
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting to log in with:", {
      email,
      teacherLoginPassword,
      role,
      schoolName,
    });
    try {
      const response = await axios.post(
        "https://school-application-three.vercel.app/api/login-teacher",
        {
          email,
          teacherLoginPassword,
          role,
          schoolName, // Pass the school name from subdomain
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
        setError(
          err.response.data.message ||
          "Login failed. Please check your credentials and try again."
        );
      } else if (err.request) {
        console.error("Error request data:", err.request);
        setError(
          "No response received from the server. Please try again later."
        );
      } else {
        console.error("Error message:", err.message);
        setError("An error occurred. Please try again.");
      }
      console.error("Error config:", err.config);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      <div className="m-12 text-5xl">{schoolName}</div>
      <LoginForm
        email={email}
        setEmail={setEmail}
        teacherLoginPassword={teacherLoginPassword}
        setTeacherLoginPassword={setTeacherLoginPassword}
        error={error}
        role={role}
        setRole={setRole}
        handleLogin={handleLogin}
      />
    </div>
  );
};

export default LoginPage;
