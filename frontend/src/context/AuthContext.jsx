import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  const login = (token, id) => {
    setAuthToken(token);
    setUserId(id);
    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", id);
  };

  const logout = () => {
    setAuthToken(null);
    setUserId(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ authToken, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
