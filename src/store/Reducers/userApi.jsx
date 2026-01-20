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
  try {
    console.log('[getUserProfileAPI] Fetching /me endpoint...');
    const response = await axiosInstance.get("/me", {
      withCredentials: true,
    });
    console.log('[getUserProfileAPI] Response:', response.data);
    // backend sometimes returns { user: {...} } and sometimes { id, username, ... }
    const user = response.data.user || response.data;
    console.log('[getUserProfileAPI] Returning user:', user);
    return user;
  } catch (error) {
    console.error('[getUserProfileAPI] Error:', error.response?.data || error.message);
    throw error;
  }
};
