import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { HeartPulse, Menu, X, Sun, Moon, LogOut, User, Calendar, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin-dashboard';
    if (user.role === 'doctor') return '/doctor-dashboard';
    return '/patient-dashboard';
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <HeartPulse className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <span className="font-poppins font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Medicare
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center ml-10 space-x-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'text-primary'
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
                }`}
              >
                Home
              </Link>
              <Link
                to="/doctors"
                className={`text-sm font-medium transition-colors ${
                  isActive('/doctors')
                    ? 'text-primary'
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
                }`}
              >
                Find Doctors
              </Link>
              {user && user.role === 'patient' && (
                <Link
                  to="/patient-dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/patient-dashboard')
                      ? 'text-primary'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
                  }`}
                >
                  My Appointments
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                {/* Dashboard Link */}
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                {/* Profile Link */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1 pr-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                    {user.profileImage ? (
                      <img
                        src={`http://localhost:5000${user.profileImage}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <User className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary px-3 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex items-center md:hidden gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2 shadow-xl">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/doctors"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Find Doctors
          </Link>

          {user && user.role === 'patient' && (
            <Link
              to="/patient-dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              My Appointments
            </Link>
          )}

          <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2">
            {user ? (
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                  Logged in as <span className="font-semibold">{user.name}</span>
                </div>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-3 py-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center py-2 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="text-center py-2 bg-primary text-white rounded-md font-medium text-sm hover:bg-primary-dark"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
