// frontend/src/features/auth/authSlice.js
// ----------------------------------------------------------
// Redux slice to handle authentication state and async actions
// Features:
// - Async thunks for register, login, and fetching current user (me)
// - Manages user info, loading, and error states
// - Includes reducers for logout and resetting errors
// ----------------------------------------------------------

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './authAPI';

// ----------------------------------------------------------
// Async thunk: Register new user
// Payload: formData (FormData object with registration info)
// On success: returns user data
// On failure: returns error message
// ----------------------------------------------------------
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, thunkAPI) => {
    try {
      const res = await api.register(formData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

// ----------------------------------------------------------
// Async thunk: Login user
// Payload: formData (login credentials)
// On success: stores token in localStorage, returns user data
// On failure: returns error message
// ----------------------------------------------------------
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, thunkAPI) => {
    try {
      const res = await api.login(formData);
      localStorage.setItem('token', res.data.token);
      return res.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

// ----------------------------------------------------------
// Async thunk: Fetch current logged-in user (me)
// No payload needed
// On success: returns user data
// On failure: returns error message
// ----------------------------------------------------------
export const fetchUser = createAsyncThunk('auth/fetchMe', async (_, thunkAPI) => {
  try {
    const res = await api.getMe();
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Failed to fetch user'
    );
  }
});

// ----------------------------------------------------------
// Redux slice definition
// ----------------------------------------------------------
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    // ----------------------------------------------------------
    // Logs out user: clears user data and token from localStorage
    // ----------------------------------------------------------
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('token');
    },
    // ----------------------------------------------------------
    // Resets error state
    // ----------------------------------------------------------
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // User data usually not returned on register, so not updating state.user here
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch current user (me)
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, resetError } = authSlice.actions;
export default authSlice.reducer;
