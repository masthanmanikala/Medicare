import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Award, MapPin, DollarSign, Stethoscope } from 'lucide-react';

const DoctorCard = ({ doctor }) => {
  // Safe extraction with default fallbacks
  const {
    specialization = 'General Physician',
    qualification = 'MBBS',
    experience = 0,
    hospital = 'Medicare Hospital',
    fees = 500,
    rating = 4.5,
    availableDays = [],
    userId,
  } = doctor;

  // The User record details are populated inside userId
  const name = userId?.name || 'Doctor Name';
  const profileImage = userId?.profileImage || '';
  const doctorId = userId?._id || doctor._id;

  const isAvailableToday = availableDays.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col h-full bg-white/70 dark:bg-slate-900/60 shadow-md"
    >
      {/* Profile Image & Badge */}
      <div className="relative h-48 bg-gradient-to-tr from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
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
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <Stethoscope className="h-10 w-10 text-primary" />
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm ${
              isAvailableToday
                ? 'bg-emerald-500/90 text-white'
                : 'bg-slate-400/90 text-white'
            }`}
          >
            {isAvailableToday ? 'Available' : 'Slots Full'}
          </span>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{rating}</span>
            <span className="text-xs text-slate-400">(45 reviews)</span>
          </div>

          <h3 className="font-poppins font-bold text-lg text-slate-800 dark:text-white line-clamp-1 mb-1">
            {name}
          </h3>
          <p className="text-xs font-semibold text-primary dark:text-primary-light uppercase tracking-wider mb-4">
            {specialization}
          </p>

          <div className="space-y-2 text-slate-600 dark:text-slate-300 text-sm mb-6">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-slate-400 shrink-0" />
              <span>{qualification} &bull; {experience} Yrs Exp</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="line-clamp-1">{hospital}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-slate-400 shrink-0" />
              <span>₹{fees} Consultation Fee</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/doctors/${doctorId}`}
          className="w-full text-center py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-primary/10 hover:shadow-primary/20 flex items-center justify-center gap-2"
        >
          View Profile
        </Link>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
