// frontend/src/features/auth/authAPI.js
// ----------------------------------------------------------
// API calls related to authentication (register, login, get user info)
// Uses axiosInstance (pre-configured axios) for HTTP requests
// ----------------------------------------------------------

import axiosInstance from '../../utils/axiosInstance';

// ----------------------------------------------------------
// Register new user with multipart/form-data (supports file uploads)
// formData: FormData object containing registration details
// ----------------------------------------------------------
export const register = (formData) =>
  axiosInstance.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ----------------------------------------------------------
// Login user with credentials (e.g., email, password)
// data: JSON object containing login credentials
// ----------------------------------------------------------
export const login = (data) => axiosInstance.post('/auth/login', data);

// ----------------------------------------------------------
// Fetch current logged-in user details
// No parameters required
// ----------------------------------------------------------
export const getMe = () => axiosInstance.get('/auth/me');
