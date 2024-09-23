import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Fix import
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
  const [name, setname] = useState();
  //  const navigate = useNavigate();
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
    let isTokenRefereshed = false;
    const handleTokenRefresh = async () => {
      if (authToken) {
        const decodedToken = jwtDecode(authToken);
        const currentTime = Date.now() / 1000;

        // Refresh the token if it's about to expire in the next 1 minute
        if (decodedToken.exp < currentTime + 60 && refreshToken) {
          await refreshAuthToken(refreshToken, decodedToken.role);
          console.log("1234", decodedToken.role);
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
      toast.error("Failed to refresh token. Please login again.");
      logout();
    }
  };

  const login = (authToken, refreshToken, user) => {
    setAuthToken(authToken);
    setRefreshToken(refreshToken);
    setname(user);

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
    toast.success("Logged out successfully!");
    // navigate("/");
  };

  return (
    <div>
      <ToastContainer/>
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
