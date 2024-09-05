import React, { useEffect, useState } from "react";
import axios from "axios";
import LoginForm from "../components/LoginPage/LoginForm";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Teacher");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
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
    console.log("Attempting to log in with:", { email, password, role });

    let apiEndpoint;
    switch (role) {
      case "Teacher":
        apiEndpoint =
          "https://school-application-three.vercel.app/api/login-teacher";
        break;
      case "Student":
        apiEndpoint =
          "https://school-application-three.vercel.app/api/login-student";
        break;
      case "Admin":
        apiEndpoint =
          "https://school-application-three.vercel.app/api/login-admin";
        break;
      case "Staff":
        apiEndpoint =
          "https://school-application-three.vercel.app/api/login-staff";
        break;
      default:
        setError("Invalid role selected.");
        return;
    }

    try {
      const response = await axios.post(
        apiEndpoint,
        {
          email,
          password, // Send the renamed password state
          role,
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
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password} // Pass the new password state
        setPassword={setPassword} // Pass the setPassword function
        handleLogin={handleLogin}
        error={error}
        role={role}
        setRole={setRole}
      />
    </div>
  );
};

export default LoginPage;
