import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          logout();
        } else {
          setAuthToken(token);
          setUserRole(decodedToken.role);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  }, []);

  const login = (token) => {
    setAuthToken(token);
    const decodedToken = jwtDecode(token);
    setUserRole(decodedToken.role);
    Cookies.set("accessToken", token, { expires: 1 });
  };

  const logout = () => {
    setAuthToken(null);
    setUserRole(null);
    Cookies.remove("accessToken");
  };

  return (
    <AuthContext.Provider value={{ authToken, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
