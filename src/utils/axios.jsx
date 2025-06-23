import axios from 'axios';

const isLocal = import.meta.env.MODE === 'development';


const axiosInstance = axios.create({
  baseURL: isLocal
    ? 'http://localhost:3000'
    : 'https://quickzy-backend.onrender.com', // Render URL

  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
