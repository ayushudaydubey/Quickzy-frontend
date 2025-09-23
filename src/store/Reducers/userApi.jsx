import axiosInstance from "../../utils/axios";


export const registerAPI = async (userData) => {
  const response = await axiosInstance.post("/register", userData, {
    withCredentials: true,
  });
  return response.data;
};


export const loginAPI = async (credentials) => {
  const response = await axiosInstance.post("/login", credentials, {
    withCredentials: true,
  });
  return response.data;
};


// Normalize /me and /profile responses to always return a user object
export const getUserProfileAPI = async () => {
  const response = await axiosInstance.get("/me", {
    withCredentials: true,
  });
  // backend sometimes returns { user: {...} } and sometimes { id, username, ... }
  return response.data.user || response.data;
};
