import React, { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

const getRefreshEndpoint = (role) => {
  switch (role) {
    case "Student":
      return "https://school-application-three.vercel.app/api/student-refresh-token-student";
    case "Admin":
      return "https://school-application-three.vercel.app/api/admin-refresh-token-admin";
    case "Teacher":
      return "https://school-application-three.vercel.app/api/teacher-refresh-token-teacher";
    case "Staff":
      return "https://school-application-three.vercel.app/api/staff-refresh-token-staff";
    default:
      return "https://school-application-three.vercel.app/api/refresh-token";
  }
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("authToken")
  );
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("refreshToken")
  );
  const [userRole, setUserRole] = useState(() => {
    const token = localStorage.getItem("authToken");
    return token ? jwtDecode(token).role : null;
  });
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const handleTokenRefresh = async () => {
      if (authToken) {
        const decodedToken = jwtDecode(authToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime && refreshToken) {
          await refreshAuthToken(refreshToken, decodedToken.role);
        }
      }
      setLoading(false); 
    };
    handleTokenRefresh();
  }, [authToken, refreshToken]);

  // Function to refresh access token
  const refreshAuthToken = async (token, role) => {
    try {
      const endpoint = getRefreshEndpoint(role);
      const response = await axios.post(
        endpoint,
        { token },
        { headers: { "Content-Type": "application/json" } }
      );

      const newAuthToken = response.data.authToken;
      const decodedToken = jwtDecode(newAuthToken);

      setAuthToken(newAuthToken);
      setUserRole(decodedToken.role);
      localStorage.setItem("authToken", newAuthToken);
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
    }
  };

  const login = (authToken, refreshToken) => {
    setAuthToken(authToken);
    setRefreshToken(refreshToken);

    const decodedToken = jwtDecode(authToken);
    setUserRole(decodedToken.role);

    localStorage.setItem("authToken", authToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const logout = () => {
    setAuthToken(null);
    setRefreshToken(null);
    setUserRole(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider
      value={{ authToken, refreshToken, userRole, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
