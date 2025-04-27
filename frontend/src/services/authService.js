import apiClient from "../api/apiClient";

const login = async (credentials) => {
  const response = await apiClient.post("/authenticate", credentials);
  return response.data;
};

const register = async (userData) => {
  const response = await apiClient.post("/register", userData);
  return response.data;
};

const getCurrentUser = async (userId) => {
  const response = await apiClient.get(`user/${userId}`);
  return response.data;
};

const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
};

export default {
  login,
  register,
  getCurrentUser,
  logout,
};
