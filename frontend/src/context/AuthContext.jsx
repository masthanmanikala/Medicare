import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, doctorService } from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize Auth & Dark Mode
  useEffect(() => {
    const initializeApp = async () => {
      // 1. Setup Dark Mode
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedDarkMode);
      if (savedDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // 2. Fetch authenticated user if token exists
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success) {
            setUser(res.user);
            setDoctorProfile(res.doctorProfile);
          } else {
            // invalid token
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('App init error:', err.message);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initializeApp();
  }, []);

  // Login
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(credentials);
      if (res.success) {
        localStorage.setItem('token', res.token);
        // Refresh details (specifically populates user and doctor profiles if role is doctor)
        const meRes = await authService.getMe();
        setUser(meRes.user);
        setDoctorProfile(meRes.doctorProfile);
        return meRes.user;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.register(userData);
      if (res.success) {
        localStorage.setItem('token', res.token);
        const meRes = await authService.getMe();
        setUser(meRes.user);
        setDoctorProfile(meRes.doctorProfile);
        return meRes.user;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setDoctorProfile(null);
  };

  // Update Profile
  const updateProfile = async (formData) => {
    setError(null);
    try {
      const res = await authService.updateProfile(formData);
      if (res.success) {
        setUser((prev) => ({
          ...prev,
          name: res.name,
          email: res.email,
          phone: res.phone,
          profileImage: res.profileImage,
        }));
        return res;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update Doctor Profile
  const updateDoctorProfile = async (profileData) => {
    setError(null);
    try {
      const res = await doctorService.updateProfile(profileData);
      if (res.success) {
        setDoctorProfile(res.doctor);
        return res.doctor;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const value = {
    user,
    doctorProfile,
    loading,
    error,
    darkMode,
    login,
    register,
    logout,
    updateProfile,
    updateDoctorProfile,
    toggleDarkMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
