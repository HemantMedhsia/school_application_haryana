import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import PyramidLoader from "../common/Loader/PyramidLoader";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const getRefreshEndpoint = (role) => {
  switch (role) {
    case "Student":
      return `${import.meta.env.VITE_BACKEND_URL}/api/refresh-token-student`;
    case "Admin":
      return `${import.meta.env.VITE_BACKEND_URL}/api/refresh-token-admin`;
    case "Teacher":
      return `${import.meta.env.VITE_BACKEND_URL}/api/refresh-token-teacher`;
    case "Staff":
      return `${import.meta.env.VITE_BACKEND_URL}/api/refresh-token-staff`;
    default:
      return "https://school-application-three.vercel.app/api/refresh-token";
  }
};

export const AuthProvider = ({ children }) => {
  const [name, setName] = useState(() => {
    const storedName = localStorage.getItem("name");
    try {
      return storedName ? JSON.parse(storedName) : null;
    } catch (error) {
      return storedName;
    }
  });

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isTokenRefreshed = false;

    const handleTokenRefresh = async () => {
      if (authToken) {
        const decodedToken = jwtDecode(authToken);
        const currentTime = Date.now() / 1000;

        // Refresh the token if it's about to expire in the next 1 minute
        if (
          decodedToken.exp < currentTime + 60 &&
          refreshToken &&
          !isTokenRefreshed
        ) {
          isTokenRefreshed = true;
          await refreshAuthToken(refreshToken, decodedToken.role);
        }
      }
      setLoading(false);
    };

    handleTokenRefresh();
  }, [authToken, refreshToken]);

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
      if (!isLoggingOut) {
        setIsLoggingOut(true);
        toast.error("Failed to refresh token. Please login again.");
        logout(false); // Pass `false` to avoid double toast
      }
    }
  };

  const login = async (authToken, refreshToken, user) => {
    setAuthToken(authToken);
    setRefreshToken(refreshToken);
    let userName;
    if (user.role === "Student") {
      userName = user.firstName;
    } else if (user.role === "Admin") {
      userName = user.name;
    } else if (user.role === "Parent") {
      userName = user.fatherName;
    } else {
      userName = user.name;
    }

    console.log("User:", user);
    setName(userName);

    const decodedToken = jwtDecode(authToken);
    setUserRole(decodedToken.role);

    localStorage.setItem("authToken", authToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("name", userName);
  };

  const logout = (showToast = true) => {
    setAuthToken(null);
    setRefreshToken(null);
    setUserRole(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("name");

    if (showToast) {
      toast.success("Logged out successfully!");
    }

    setIsLoggingOut(false);
    // navigate("/"); // Uncomment if you want to navigate after logout
  };

  return (
    <div>
      <ToastContainer />
      <AuthContext.Provider
        value={{
          authToken,
          refreshToken,
          userRole,
          name,
          login,
          logout,
          loading,
        }}
      >
        {!loading ? children : <PyramidLoader desc={""} />}
      </AuthContext.Provider>
    </div>
  );
};

export const useAuth = () => useContext(AuthContext);
