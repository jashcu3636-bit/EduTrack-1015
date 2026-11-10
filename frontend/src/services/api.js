import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized (401)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API Endpoints
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me'),
};

// Students Management API Endpoints
export const studentAPI = {
  getAll: (params) => API.get('/students', { params }),
  getStats: () => API.get('/students/stats'),
  getAtRisk: () => API.get('/students/at-risk'),
  getById: (id) => API.get(`/students/${id}`),
  create: (data) => API.post('/students', data),
  update: (id, data) => API.put(`/students/${id}`, data),
  addGrade: (id, data) => API.post(`/students/${id}/grades`, data),
  delete: (id) => API.delete(`/students/${id}`),
  seedDemo: () => API.post('/students/seed'),
};

// Daily Attendance API Endpoints
export const attendanceAPI = {
  getClassRoster: (params) => API.get('/attendance/class', { params }),
  markBulk: (data) => API.post('/attendance/mark-bulk', data),
  getStudentHistory: (id) => API.get(`/attendance/student/${id}`),
  getAllHistory: (params) => API.get('/attendance/history-all', { params }),
};

export default API;
