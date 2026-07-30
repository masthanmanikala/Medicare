import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { appointmentService, doctorService } from '../services/api.js';
import AppointmentCard from '../components/AppointmentCard.jsx';
import Loader from '../components/Loader.jsx';
import toast from 'react-hot-toast';
import { Calendar, Users, Stethoscope, DollarSign, Award, Clock, MapPin, Save, FileText } from 'lucide-react';

const DoctorDashboard = () => {
  const { user, doctorProfile, updateDoctorProfile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States for Profile / Availability Updates
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [hospital, setHospital] = useState('');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [savingProfile, setSavingProfile] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchDashboardData = async () => {
    try {
      const res = await appointmentService.getAppointments();
      if (res.success) {
        setAppointments(res.appointments);
      }
    } catch (err) {
      console.error(err.message);
      toast.error('Failed to retrieve appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Load doctor profile settings into form states
    if (doctorProfile) {
      setSpecialization(doctorProfile.specialization || '');
      setQualification(doctorProfile.qualification || '');
      setExperience(doctorProfile.experience || '');
      setHospital(doctorProfile.hospital || '');
      setFees(doctorProfile.fees || '');
      setAbout(doctorProfile.about || '');
      setSelectedDays(doctorProfile.availableDays || []);
    }
  }, [doctorProfile]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await appointmentService.updateStatus(id, status);
      if (res.success) {
        toast.success(`Appointment status updated to ${status}`);
        // Update local state directly
        setAppointments((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status } : app))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleDayToggle = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateDoctorProfile({
        specialization,
        qualification,
        experience,
        hospital,
        fees,
        about,
        availableDays: selectedDays,
      });
      toast.success('Professional profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update doctor profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // Analytics
  const totalBookings = appointments.length;
  const upcomingBookings = appointments.filter((app) => app.status === 'pending' || app.status === 'confirmed').length;
  const completedConsults = appointments.filter((app) => app.status === 'completed').length;

  if (loading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen"
    >
      <div className="space-y-8">
        
        {/* Title */}
        <div className="space-y-1">
          <h1 className="font-poppins font-extrabold text-3xl text-slate-800 dark:text-white">
            Doctor Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage your schedule, handle client requests, and update practice details.
          </p>
        </div>

        {/* Analytics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-card rounded-2xl p-6 bg-white/70 dark:bg-slate-900/60 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="p-3.5 bg-primary/10 rounded-xl text-primary"><Calendar className="h-6 w-6" /></div>
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Total Bookings</span>
              <h3 className="font-poppins font-extrabold text-2xl text-slate-800 dark:text-white mt-1">{totalBookings}</h3>
            </div>
          </div>
          {/* Card 2 */}
          <div className="glass-card rounded-2xl p-6 bg-white/70 dark:bg-slate-900/60 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="p-3.5 bg-amber-500/10 rounded-xl text-amber-500"><Clock className="h-6 w-6" /></div>
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Upcoming Consults</span>
              <h3 className="font-poppins font-extrabold text-2xl text-slate-800 dark:text-white mt-1">{upcomingBookings}</h3>
            </div>
          </div>
          {/* Card 3 */}
          <div className="glass-card rounded-2xl p-6 bg-white/70 dark:bg-slate-900/60 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="p-3.5 bg-emerald-500/10 rounded-xl text-emerald-500"><Users className="h-6 w-6" /></div>
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Completed consultations</span>
              <h3 className="font-poppins font-extrabold text-2xl text-slate-800 dark:text-white mt-1">{completedConsults}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Appointments Schedule Requests */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-poppins font-extrabold text-lg text-slate-800 dark:text-white">
                Patient Bookings List
              </h3>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Sorted by date</span>
            </div>

            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((app) => (
                  <AppointmentCard
                    key={app._id}
                    appointment={app}
                    role="doctor"
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))
              ) : (
                <div className="glass-card rounded-2xl p-12 text-center text-slate-500 border border-slate-100 dark:border-slate-800/80">
                  No appointments booked under your practice yet.
                </div>
              )}
            </div>
          </div>

          {/* Right: Quick professional profile and schedule config */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/70 dark:bg-slate-900/60 shadow-md border border-slate-100 dark:border-slate-800">
              <h3 className="font-poppins font-extrabold text-lg text-slate-800 dark:text-white mb-6 pb-2 border-b border-slate-150 dark:border-slate-800">
                Practice Settings
              </h3>

              <form onSubmit={handleProfileSave} className="space-y-4">
                
                {/* Specialization */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <Stethoscope className="h-3.5 w-3.5" />
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Cardiologist"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/45 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    required
                  />
                </div>

                {/* Qualification & Experience */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" />
                      Quals
                    </label>
                    <input
                      type="text"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      placeholder="e.g. MBBS, MD"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/45 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Exp (Yrs)
                    </label>
                    <input
                      type="number"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/45 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Hospital & Fees */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      Hospital
                    </label>
                    <input
                      type="text"
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      placeholder="e.g. Metro Clinic"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/45 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      Fees ($)
                    </label>
                    <input
                      type="number"
                      value={fees}
                      onChange={(e) => setFees(e.target.value)}
                      placeholder="e.g. 600"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/45 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* About Doctor */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    Professional Bio
                  </label>
                  <textarea
                    rows="3"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Describe your medical practice expertise..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/45 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                  ></textarea>
                </div>

                {/* Availability Days */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Available Days
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {daysOfWeek.map((day) => {
                      const isSelected = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(day)}
                          className={`px-2.5 py-1 text-[10px] rounded-lg font-bold uppercase transition-all ${
                            isSelected
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {day.substring(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Profile */}
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-2.5 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 mt-6"
                >
                  {savingProfile ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      Save Practice Profile
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default DoctorDashboard;
