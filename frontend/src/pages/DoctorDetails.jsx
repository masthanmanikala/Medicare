import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doctorService } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import { Star, Award, MapPin, DollarSign, Calendar, Clock, Stethoscope, ChevronLeft, ArrowRight } from 'lucide-react';

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const res = await doctorService.getDoctorById(id);
        if (res.success) {
          setDoctor(res.doctor);
        }
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  if (loading) return <Loader />;

  if (!doctor) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Doctor Profile Not Found</h3>
        <p className="text-sm text-slate-500">The profile you are looking for does not exist or has been disabled.</p>
        <Link to="/doctors" className="text-primary hover:underline font-semibold">Back to Doctors</Link>
      </div>
    );
  }

  const {
    specialization,
    qualification,
    experience,
    hospital,
    fees,
    about,
    rating,
    availableDays = [],
    availableSlots = [],
    userId,
  } = doctor;

  const name = userId?.name || 'Healthcare Professional';
  const email = userId?.email || '';
  const phone = userId?.phone || '';
  const profileImage = userId?.profileImage || '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen"
    >
      {/* Back Button */}
      <Link
        to="/doctors"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary mb-8 transition-colors"
      >
        <ChevronLeft className="h-4.5 w-4.5" />
        Back to Doctors List
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Doctor Profile Header Card */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/70 dark:bg-slate-900/60 shadow-md flex flex-col sm:flex-row gap-8 items-start border border-slate-100 dark:border-slate-800">
            
            {/* Image Container */}
            <div className="w-full sm:w-48 h-48 rounded-2xl overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
              {profileImage ? (
                <img
                  src={`http://localhost:5000${profileImage}`}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <Stethoscope className="h-16 w-16 text-primary" />
              )}
            </div>

            {/* Title / Primary Info */}
            <div className="space-y-4 flex-grow">
              <div>
                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-slate-800 dark:text-white">{rating}</span>
                  <span className="text-xs text-slate-400">(45 Verified Reviews)</span>
                </div>

                <h1 className="font-poppins font-extrabold text-2xl sm:text-3xl text-slate-800 dark:text-white">
                  {name}
                </h1>
                <p className="text-sm font-bold text-primary dark:text-primary-light uppercase tracking-wider mt-1">
                  {specialization}
                </p>
              </div>

              {/* Badges details grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-sm">
                <div className="flex items-start gap-2.5">
                  <Award className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block uppercase font-bold">Qualification</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{qualification}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block uppercase font-bold">Experience</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{experience} Years Exp</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block uppercase font-bold">Clinic / Hospital</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200 line-clamp-1">{hospital}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <DollarSign className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block uppercase font-bold">Consult Fee</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">${fees} per slot</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* About Doctor Section */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/70 dark:bg-slate-900/60 shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="font-poppins font-extrabold text-lg text-slate-800 dark:text-white mb-4">
              About this Doctor
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {about || 'No details available.'}
            </p>
          </div>
        </div>

        {/* Right Column: Availability & Booking CTA Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-3xl p-6 bg-white/70 dark:bg-slate-900/60 shadow-md border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="font-poppins font-extrabold text-lg text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Operating Schedule
              </h3>
              
              {/* Working Days */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wide flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  Available Days
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {availableDays.map((day) => (
                    <span
                      key={day}
                      className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              {/* Working Hours */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wide flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-accent" />
                  Available Time Slots
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {availableSlots.map((slot) => (
                    <span
                      key={slot}
                      className="text-xs font-medium px-2 py-1 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-md"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking CTA Button */}
            <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800">
              <Link
                to={`/book-appointment/${id}`}
                className="w-full text-center py-3.5 bg-accent hover:bg-accent-dark text-white rounded-2xl text-sm font-semibold transition-all shadow-md shadow-accent/25 hover:shadow-accent/35 flex items-center justify-center gap-2 group"
              >
                Book Appointment Slot
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2.5">
                Double bookings are prevented automatically.
              </p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default DoctorDetails;
