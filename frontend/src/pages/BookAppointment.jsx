import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doctorService, appointmentService } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import toast from 'react-hot-toast';
import { Calendar, Clock, AlertTriangle, ArrowRight, Stethoscope, FileText, ChevronLeft } from 'lucide-react';

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Form State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await doctorService.getDoctorById(id);
        if (res.success) {
          setDoctor(res.doctor);
        }
      } catch (err) {
        console.error(err.message);
        toast.error('Could not load doctor details');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  // Set minimum date to today
  const getMinDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedDate) return toast.error('Please choose a date for your appointment');
    if (!selectedSlot) return toast.error('Please choose a time slot');
    if (!symptoms.trim()) return toast.error('Please describe your symptoms briefly');

    setBookingLoading(true);
    try {
      const res = await appointmentService.bookAppointment({
        doctorId: doctor.userId._id,
        date: selectedDate,
        time: selectedSlot,
        symptoms,
      });

      if (res.success) {
        toast.success('Appointment booked successfully!');
        navigate('/patient-dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Double booking conflict. Choose another slot.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (!doctor) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h3 className="text-xl font-bold">Doctor Not Found</h3>
        <p className="text-slate-500">Redirecting to doctor search...</p>
        <Link to="/doctors" className="text-primary hover:underline">Go to Doctors</Link>
      </div>
    );
  }

  const { availableSlots = [], availableDays = [] } = doctor;
  const docName = doctor.userId?.name || 'Doctor';
  const specialization = doctor.specialization;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen"
    >
      {/* Back link */}
      <Link
        to={`/doctors/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary mb-8 transition-colors"
      >
        <ChevronLeft className="h-4.5 w-4.5" />
        Back to Profile
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-3xl p-6 bg-white/70 dark:bg-slate-900/60 shadow-md border border-slate-100 dark:border-slate-800">
            <h3 className="font-poppins font-extrabold text-slate-800 dark:text-white mb-4 uppercase text-xs tracking-wider">
              Booking With
            </h3>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-poppins font-bold text-slate-800 dark:text-white leading-snug">{docName}</h4>
                <p className="text-xs font-semibold text-primary/80 uppercase tracking-wide">{specialization}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Consultation Fee:</span>
                <span className="font-bold text-slate-800 dark:text-white">${doctor.fees}</span>
              </div>
              <div className="flex justify-between">
                <span>Clinic:</span>
                <span className="font-medium">{doctor.hospital}</span>
              </div>
            </div>

            {/* Availability Days Notice */}
            <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl text-xs text-amber-800 dark:text-amber-400">
              <div className="flex gap-1.5 font-semibold mb-1">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Doctor availability days:</span>
              </div>
              <p className="pl-5">{availableDays.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Wizard Form */}
        <div className="lg:col-span-8">
          <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/70 dark:bg-slate-900/60 shadow-md border border-slate-100 dark:border-slate-800">
            <h2 className="font-poppins font-extrabold text-2xl text-slate-800 dark:text-white mb-6">
              Schedule Your Appointment
            </h2>

            <form onSubmit={handleBooking} className="space-y-6">
              
              {/* Step 1: Select Date */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wide flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  1. Choose Date
                </label>
                <input
                  type="date"
                  min={getMinDate()}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full max-w-xs px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  required
                />
              </div>

              {/* Step 2: Choose Slot */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wide flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-accent" />
                  2. Select Time Slot
                </label>

                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all text-center ${
                          selectedSlot === slot
                            ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/40 dark:bg-slate-950/20 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No slots defined for this doctor.</p>
                )}
              </div>

              {/* Step 3: Symptoms */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wide flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-primary" />
                  3. Describe Symptoms
                </label>
                <textarea
                  rows="4"
                  placeholder="Please specify any symptoms, medical background, or specific questions for the doctor..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
                  required
                ></textarea>
              </div>

              {/* Step 4: Submit Booking */}
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-3.5 bg-accent hover:bg-accent-dark disabled:bg-accent/50 text-white rounded-2xl font-semibold text-sm transition-all shadow-lg shadow-accent/25 hover:shadow-accent/35 flex items-center justify-center gap-2"
              >
                {bookingLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Confirm Booking
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default BookAppointment;
