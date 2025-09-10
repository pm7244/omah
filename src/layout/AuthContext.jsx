import Cookies from "js-cookie";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async ({ username, password }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL}api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        Cookies.set("jwt", data.token);
        return { status: "success" };
      } else {
        toast.error(data.error);  
        return { status: "failed" };
      }
    } catch (error) {
      toast.error("Login failed");
    }
  };

  const logout = () => {
    Cookies.remove("jwt");
    toast.error("Logged Out");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      setIsAuthenticated((prv) => (prv = true));
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
