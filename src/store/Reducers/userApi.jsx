
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


export const getUserProfileAPI = async () => {
  const response = await axiosInstance.get("/me", {
    withCredentials: true,
  });
  return response.data;
};
