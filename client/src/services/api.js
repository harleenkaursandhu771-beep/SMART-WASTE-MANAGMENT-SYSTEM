/**
 * API Service Layer
 * Connects to Express backend on port 5000 via Vite proxy.
 */
import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth APIs ──────────────────────────────────────────────
export const loginUser = (email, password) => api.post('/login', { email, password });
export const registerUser = (userData) => api.post('/register', userData);

// ─── User APIs ──────────────────────────────────────────────
export const getUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// ─── Bin APIs ───────────────────────────────────────────────
export const getBins = () => api.get('/bins');
export const createBin = (binData) => api.post('/bins', binData);
export const updateBin = (id, binData) => api.put(`/bins/${id}`, binData);
export const deleteBin = (id) => api.delete(`/bins/${id}`);

// ─── Report APIs ────────────────────────────────────────────
export const getReports = () => api.get('/reports');
export const createReport = (reportData) => api.post('/reports', reportData);
export const updateReport = (id, reportData) => api.put(`/reports/${id}`, reportData);
export const deleteReport = (id) => api.delete(`/reports/${id}`);

// ─── Task APIs ──────────────────────────────────────────────
export const getTasks = () => api.get('/tasks');
export const createTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// ─── Vehicle APIs ───────────────────────────────────────────
export const getVehicles = () => api.get('/vehicles');
export const createVehicle = (vehicleData) => api.post('/vehicles', vehicleData);
export const updateVehicle = (id, vehicleData) => api.put(`/vehicles/${id}`, vehicleData);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);

// ─── Notification APIs ──────────────────────────────────────
export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (id) => api.put(`/notifications/${id}`);
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

// ─── Feedback APIs ──────────────────────────────────────────
export const getFeedback = () => api.get('/feedback');
export const createFeedback = (feedbackData) => api.post('/feedback', feedbackData);
export const deleteFeedback = (id) => api.delete(`/feedback/${id}`);

// ─── Activity Log APIs ──────────────────────────────────────
export const getActivityLogs = () => api.get('/activity-logs');

export default api;
