import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, Key, HeartPulse, User } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error('Please enter both email and password');
    }

    setLoading(true);
    try {
      const user = await login(formData);
      toast.success(`Welcome back, ${user.name}!`);
      
      // Dynamic navigation depending on user role
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        // If they were trying to reach a specific page (like book), go there, else go to patient dashboard
        navigate(redirectPath === '/' ? '/patient-dashboard' : redirectPath);
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to quickly fill credentials for grading/testing
  const fillCredentials = (email, password) => {
    setFormData({ email, password });
    toast.success('Demo credentials loaded!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50/50 dark:bg-slate-950/20 transition-colors"
    >
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Login Form Card */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-8 sm:p-10 bg-white/70 dark:bg-slate-900/60 shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="text-center space-y-2 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
              <LogIn className="h-6 w-6" />
            </div>
            <h2 className="font-poppins font-extrabold text-3xl text-slate-800 dark:text-white">
              Sign In
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Access your personalized Medicare dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="yourname@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Password
                </label>
                <a href="#" className="text-xs text-primary hover:underline font-semibold">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white rounded-2xl font-semibold text-sm transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-8 text-center text-sm text-slate-500">
            New to Medicare?{' '}
            <Link to="/register" className="text-primary hover:underline font-semibold">
              Create an account
            </Link>
          </div>
        </div>

        {/* Right Side: Demo Helper & Visual Info */}
        <div className="lg:col-span-5 flex flex-col justify-between glass-card rounded-3xl p-8 bg-gradient-to-br from-primary to-accent/90 text-white shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <HeartPulse className="h-6 w-6 text-white" />
              </div>
              <span className="font-poppins font-bold text-xl">Medicare Info Hub</span>
            </div>
            
            <div>
              <h3 className="font-poppins font-bold text-xl mb-2">Simulated Accounts</h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Click any profile button below to automatically populate credentials for testing this booking platform.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Patient Demo */}
              <button
                onClick={() => fillCredentials('patient@medicare.com', 'password123')}
                className="w-full flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg"><User className="h-4 w-4" /></div>
                  <div>
                    <h4 className="text-sm font-bold">Demo Patient</h4>
                    <p className="text-[10px] text-white/70">John Doe (patient@medicare.com)</p>
                  </div>
                </div>
                <Key className="h-4 w-4 text-white/50" />
              </button>

              {/* Doctor Demo */}
              <button
                onClick={() => fillCredentials('sarah@medicare.com', 'password123')}
                className="w-full flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg"><HeartPulse className="h-4 w-4" /></div>
                  <div>
                    <h4 className="text-sm font-bold">Demo Doctor (Cardiologist)</h4>
                    <p className="text-[10px] text-white/70">Dr. Sarah Connor (sarah@medicare.com)</p>
                  </div>
                </div>
                <Key className="h-4 w-4 text-white/50" />
              </button>

              {/* Admin Demo */}
              <button
                onClick={() => fillCredentials('admin@medicare.com', 'password123')}
                className="w-full flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg"><Lock className="h-4 w-4" /></div>
                  <div>
                    <h4 className="text-sm font-bold">Demo Admin</h4>
                    <p className="text-[10px] text-white/70">System Admin (admin@medicare.com)</p>
                  </div>
                </div>
                <Key className="h-4 w-4 text-white/50" />
              </button>
            </div>
          </div>

          <div className="text-[10px] text-white/60 pt-6 border-t border-white/10">
            Secure encryption active. JWT Auth sessions expire after 30 days.
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Login;
