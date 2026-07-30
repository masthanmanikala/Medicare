import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle, CheckCircle2, XCircle, Stethoscope, Check, X, Ban } from 'lucide-react';

const AppointmentCard = ({ appointment, role, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    _id,
    date,
    time,
    symptoms,
    status,
    patientId,
    doctorId,
    doctorProfile,
  } = appointment;

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(_id, newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusStyle = () => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-rose-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
  };

  // Determine whose details to show
  const showDoctorDetails = role === 'patient' || role === 'admin';
  const showPatientDetails = role === 'doctor' || role === 'admin';

  // Details
  const docName = doctorId?.name || 'Dr. Health';
  const docImage = doctorId?.profileImage || '';
  const specialization = doctorProfile?.specialization || 'Healthcare Expert';
  const hospital = doctorProfile?.hospital || 'Medicare Hospital';
  const fees = doctorProfile?.fees || 500;

  const patName = patientId?.name || 'Patient';
  const patPhone = patientId?.phone || 'No Phone';
  const patImage = patientId?.profileImage || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="glass-card rounded-2xl p-6 bg-white/70 dark:bg-slate-900/60 shadow-sm border border-slate-100 dark:border-slate-800"
    >
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        
        {/* Left Side: Doctor or Patient Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
            {showDoctorDetails && (
              docImage ? (
                <img src={`http://localhost:5000${docImage}`} alt={docName} className="w-full h-full object-cover" />
              ) : (
                <Stethoscope className="h-6 w-6 text-primary" />
              )
            )}
            {showPatientDetails && !showDoctorDetails && (
              patImage ? (
                <img src={`http://localhost:5000${patImage}`} alt={patName} className="w-full h-full object-cover" />
              ) : (
                <div className="h-6 w-6 text-primary font-bold font-poppins text-lg flex items-center justify-center">
                  {patName[0]}
                </div>
              )
            )}
          </div>

          <div>
            {showDoctorDetails && (
              <>
                <h4 className="font-poppins font-bold text-slate-800 dark:text-white">{docName}</h4>
                <p className="text-xs text-primary font-semibold uppercase">{specialization}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{hospital}</p>
              </>
            )}
            {showPatientDetails && !showDoctorDetails && (
              <>
                <h4 className="font-poppins font-bold text-slate-800 dark:text-white">{patName}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Phone: {patPhone}</p>
              </>
            )}
            {role === 'admin' && (
              <div className="mt-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-1 text-slate-400">
                Patient: <span className="font-semibold text-slate-600 dark:text-slate-300">{patName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Middle Side: Date, Time & Symptoms */}
        <div className="flex flex-wrap gap-4 lg:gap-8 items-center text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent shrink-0" />
            <span>{time}</span>
          </div>
          <div className="w-full lg:w-auto max-w-xs bg-slate-50 dark:bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800/80">
            <span className="text-xs text-slate-400 block font-semibold mb-0.5 uppercase tracking-wide">Symptoms:</span>
            <p className="text-xs line-clamp-2 italic text-slate-600 dark:text-slate-300">{symptoms}</p>
          </div>
        </div>

        {/* Right Side: Status Badge & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto justify-between lg:justify-end shrink-0">
          {/* Status Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusStyle()}`}>
            {getStatusIcon()}
            <span>{status}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {isUpdating ? (
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                {/* Patient actions: Can only cancel if pending/confirmed */}
                {role === 'patient' && (status === 'pending' || status === 'confirmed') && (
                  <button
                    onClick={() => handleStatusChange('cancelled')}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 border border-red-200 dark:border-red-900/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                  >
                    <Ban className="h-3 w-3" />
                    Cancel Booking
                  </button>
                )}

                {/* Doctor actions: Confirm or cancel if pending */}
                {role === 'doctor' && status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange('confirmed')}
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-primary text-white hover:bg-primary-dark rounded-lg transition-all shadow-sm"
                    >
                      <Check className="h-3 w-3" />
                      Confirm
                    </button>
                    <button
                      onClick={() => handleStatusChange('cancelled')}
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-red-500 rounded-lg transition-colors"
                    >
                      <X className="h-3 w-3" />
                      Decline
                    </button>
                  </>
                )}

                {/* Doctor actions: Complete if confirmed */}
                {role === 'doctor' && status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusChange('completed')}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-accent text-white hover:bg-accent-dark rounded-lg transition-all shadow-sm"
                  >
                    <Check className="h-3 w-3" />
                    Complete
                  </button>
                )}

                {/* Admin actions: Delete or update */}
                {role === 'admin' && status === 'pending' && (
                  <button
                    onClick={() => handleStatusChange('confirmed')}
                    className="text-xs font-semibold px-3 py-1.5 bg-primary text-white hover:bg-primary-dark rounded-lg transition-all"
                  >
                    Approve
                  </button>
                )}
              </>
            )}
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default AppointmentCard;
