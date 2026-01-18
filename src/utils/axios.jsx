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

// Token is automatically sent via httpOnly cookies with withCredentials: true
// No need to manually add Authorization header from localStorage

export default axiosInstance;
