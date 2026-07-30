import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { appointmentService } from '../services/api.js';
import AppointmentCard from '../components/AppointmentCard.jsx';
import Loader from '../components/Loader.jsx';
import toast from 'react-hot-toast';
import { Calendar, User, Search, Stethoscope, ArrowRight } from 'lucide-react';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.getAppointments();
      if (res.success) {
        setAppointments(res.appointments);
      }
    } catch (err) {
      console.error(err.message);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await appointmentService.updateStatus(id, status);
      if (res.success) {
        toast.success(`Booking ${status} successfully`);
        // Refresh local state without reloading whole API
        setAppointments((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status } : app))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  // Filters mapping
  const filteredAppointments = appointments.filter((app) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return app.status === 'pending' || app.status === 'confirmed';
    return app.status === filter;
  });

  if (loading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen"
    >
      <div className="space-y-8">
        
        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="font-poppins font-extrabold text-3xl text-slate-800 dark:text-white">
              My Appointments
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              View consult history, check active schedules, or cancel slots.
            </p>
          </div>
          <Link
            to="/doctors"
            className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Search className="h-4 w-4" />
            Book New Doctor
          </Link>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          {['all', 'upcoming', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filter === tab
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((app) => (
                <AppointmentCard
                  key={app._id}
                  appointment={app}
                  role="patient"
                  onStatusUpdate={handleStatusUpdate}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Calendar className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-lg text-slate-800 dark:text-white">
                    No Appointments Found
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                    You do not have any {filter !== 'all' ? `${filter} ` : ''}appointments registered.
                  </p>
                </div>
                {filter === 'all' && (
                  <Link
                    to="/doctors"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Browse doctors list to book <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
};

export default PatientDashboard;
