import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import toast from 'react-hot-toast';
import { Users, Stethoscope, Calendar, Trash2, ShieldAlert, BarChart3, Clock, CheckSquare } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  const fetchAdminData = async () => {
    try {
      const [usersRes, docsRes, statsRes] = await Promise.all([
        adminService.getUsers(),
        adminService.getDoctors(),
        adminService.getStats(),
      ]);

      if (usersRes.success) setUsers(usersRes.users);
      if (docsRes.success) setDoctors(docsRes.doctors);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      console.error(err.message);
      toast.error('Failed to load admin management panel data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete/block user: ${name}? This will clean up all active appointments.`)) {
      return;
    }

    try {
      const res = await adminService.deleteUser(id);
      if (res.success) {
        toast.success(res.message);
        // Refresh local data state
        setUsers((prev) => prev.filter((user) => user._id !== id));
        setDoctors((prev) => prev.filter((doc) => doc.userId?._id !== id));
        // Refresh stats
        const statsRes = await adminService.getStats();
        if (statsRes.success) setStats(statsRes.stats);
      }
    } catch (err) {
      toast.error(err.message || 'Deletion failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen"
    >
      <div className="space-y-8">
        
        {/* Header */}
        <div className="space-y-1">
          <h1 className="font-poppins font-extrabold text-3xl text-slate-800 dark:text-white flex items-center gap-2">
            <ShieldAlert className="h-8 w-8 text-primary animate-pulse" />
            Medicare Admin Panel
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Monitor clinic performance statistics, review doctor rosters, and manage registered users.
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card rounded-2xl p-5 bg-white/70 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Users className="h-6 w-6" /></div>
              <div>
                <span className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide">Patients</span>
                <h4 className="font-poppins font-bold text-2xl text-slate-800 dark:text-white mt-0.5">{stats.totalUsers}</h4>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 bg-white/70 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><Stethoscope className="h-6 w-6" /></div>
              <div>
                <span className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide">Doctors</span>
                <h4 className="font-poppins font-bold text-2xl text-slate-800 dark:text-white mt-0.5">{stats.totalDoctors}</h4>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 bg-white/70 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500"><Calendar className="h-6 w-6" /></div>
              <div>
                <span className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide">Appointments</span>
                <h4 className="font-poppins font-bold text-2xl text-slate-800 dark:text-white mt-0.5">{stats.totalAppointments}</h4>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 bg-white/70 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500"><Clock className="h-6 w-6" /></div>
              <div>
                <span className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide">Pending Tasks</span>
                <h4 className="font-poppins font-bold text-2xl text-slate-800 dark:text-white mt-0.5">{stats.pendingAppointments}</h4>
              </div>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'users' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Patients List
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'doctors' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Doctors Roster
          </button>
        </div>

        {/* Management Area */}
        <div className="glass-card rounded-2xl overflow-hidden bg-white/70 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Users Table */}
              {activeTab === 'users' && (
                <motion.table
                  key="users"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full text-left border-collapse"
                >
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Role</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {users.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30">
                        <td className="p-4 font-semibold text-slate-800 dark:text-white">{item.name}</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">{item.email}</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">{item.phone}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-slate-105 border text-slate-500">
                            {item.role}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(item._id, item.name)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors inline-flex items-center"
                            title="Block User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </motion.table>
              )}

              {/* Tab 2: Doctors Table */}
              {activeTab === 'doctors' && (
                <motion.table
                  key="doctors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full text-left border-collapse"
                >
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4">Doctor</th>
                      <th className="p-4">Speciality</th>
                      <th className="p-4">Hospital</th>
                      <th className="p-4">Fees</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {doctors.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30">
                        <td className="p-4">
                          <div className="font-semibold text-slate-800 dark:text-white">
                            {item.userId?.name || 'Practitioner'}
                          </div>
                          <div className="text-xs text-slate-400">{item.userId?.email || 'N/A'}</div>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{item.specialization}</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">{item.hospital}</td>
                        <td className="p-4 font-bold text-slate-700 dark:text-slate-200">${item.fees}</td>
                        <td className="p-4 text-right font-medium">
                          {item.userId && (
                            <button
                              onClick={() => handleDeleteUser(item.userId._id, item.userId.name)}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors inline-flex items-center"
                              title="Ban Doctor"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </motion.table>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default AdminDashboard;
