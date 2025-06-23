import axiosInstance from "../../utils/axios";

export const registerAPI = async (userData) => {
  const response = await axiosInstance.post("/register", userData, {
    withCredentials: true,
  });
  return response.data;
};

export const loginAPI = async (credentials) => {
  const res = await axiosInstance.post('/login', credentials, {
    withCredentials: true,
  });
  return res.data;
};
