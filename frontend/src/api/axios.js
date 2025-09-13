import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data);
    
    if (error.response?.status === 403) {
      // Handle forbidden errors (non-admin trying to modify)
      toast.error('Only administrators can perform this action');
    } else if (error.response?.status === 401) {
      // Handle unauthorized errors
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else {
      // Handle other errors
      toast.error(error.response?.data?.message || 'An error occurred');
    }
    return Promise.reject(error);
  }
);

export default api;
