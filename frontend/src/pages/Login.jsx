// frontend/src/src/pages/Login.jsx
// ----------------------------------------------------------
// Login page component
// Handles user login with form state, redux dispatch, and redirects
// Displays loader during login process and shows error messages
// ----------------------------------------------------------

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, resetError } from '../features/auth/authSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

export default function Login() {
  // Local state to manage form inputs
  const [form, setForm] = useState({ email: '', password: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract error, loading, and user state from auth slice
  const { error, loading, user } = useSelector((state) => state.auth);

  // Determine where to redirect after login (default is home page '/')
  const from = location.state?.from?.pathname || '/';

  // Clear any previous errors on component mount
  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  // When user successfully logs in, show success toast and navigate to intended page
  useEffect(() => {
    if (user) {
      toast.success('Login successful!');
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Update form state on input change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle form submit: dispatch loginUser thunk
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(loginUser(form)).unwrap();
      toast.success('Welcome back, ' + res.username + '!');
    } catch (err) {
      toast.error(err.message || 'Login failed.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {/* Overlay loader when loading */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-60 flex justify-center items-center z-10">
            <Loader />
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login to Your Account
        </h2>

        {/* Show error message if exists and not loading */}
        {error && !loading && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Link to registration page */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
