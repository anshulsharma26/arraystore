import axios from 'axios';

const API = axios.create({
  baseURL: '/api/auth',
  withCredentials: true,
});

export const registerUser = (userData) => API.post('/register', userData);
export const loginUser = (userData) => API.post('/login', userData);
export const logoutUser = () => API.post('/logout');
export const getMe = () => API.get('/me');
export const updateProfile = (userData) => API.put('/profile', userData);
export const forgotPassword = (email) => API.post('/forgot-password', { email });
export const resetPassword = (token, password) => API.put(`/reset-password/${token}`, { password });
