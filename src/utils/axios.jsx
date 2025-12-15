import axios from 'axios';

const isLocal = import.meta.env.MODE === 'development';


const axiosInstance = axios.create({
  baseURL: isLocal
    ? 'http://localhost:3000'
    : 'https://quickzy-backend.onrender.com', // Render URL new 

  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header from localStorage if available (Bearer token)
axiosInstance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

export default axiosInstance;
