
import axios from 'axios';

const isLocal = process.env.NODE_ENV === 'development';

const axiosInstance = axios.create({
  baseURL: isLocal
    ? 'http://localhost:3000'
    : 'https://quickzy-backend.onrender.com',

  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
