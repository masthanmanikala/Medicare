import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add Authorization token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Auth Services
export const authService = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me'),
  updateProfile: (formData) => {
    // If formData contains an image file, use multipart/form-data
    return API.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Doctor Services
export const doctorService = {
  getDoctors: (params) => API.get('/doctors', { params }),
  getDoctorById: (id) => API.get(`/doctors/${id}`),
  createProfile: (profileData) => API.post('/doctors', profileData),
  updateProfile: (profileData) => API.put('/doctors/profile', profileData),
};

// Appointment Services
export const appointmentService = {
  bookAppointment: (bookingData) => API.post('/appointments', bookingData),
  getAppointments: () => API.get('/appointments'),
  updateStatus: (id, status) => API.put(`/appointments/${id}/status`, { status }),
};

// Admin Services
export const adminService = {
  getUsers: () => API.get('/admin/users'),
  getDoctors: () => API.get('/admin/doctors'),
  deleteUser: (id) => API.delete(`/admin/user/${id}`),
  getStats: () => API.get('/admin/stats'),
};

export default API;
