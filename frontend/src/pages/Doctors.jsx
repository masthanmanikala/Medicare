import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doctorService } from '../services/api.js';
import DoctorCard from '../components/DoctorCard.jsx';
import Loader from '../components/Loader.jsx';
import { Search, Filter, RefreshCw, XCircle, Stethoscope } from 'lucide-react';

const Doctors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || 'All');
  const [minExperience, setMinExperience] = useState('');

  // Dropdown list
  const specializations = ['All', 'Cardiologist', 'Pediatrician', 'Dermatologist', 'Orthopedist'];

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (specialization && specialization !== 'All') params.specialization = specialization;
      if (minExperience) params.minExperience = minExperience;

      const res = await doctorService.getDoctors(params);
      if (res.success) {
        setDoctors(res.doctors);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when parameters or values change
  useEffect(() => {
    fetchDoctors();
  }, [specialization, minExperience]);

  // Sync state if url params change
  useEffect(() => {
    const urlSpec = searchParams.get('specialization');
    if (urlSpec) {
      setSpecialization(urlSpec);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSpecialization('All');
    setMinExperience('');
    setSearchParams({});
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen"
    >
      <div className="space-y-8">
        
        {/* Header Title */}
        <div className="space-y-2">
          <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl text-slate-800 dark:text-white">
            Find Healthcare Specialists
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg">
            Search name, choose category specialities, and review experience levels to book your timing slot.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-card rounded-2xl p-6 bg-white/70 dark:bg-slate-900/60 shadow-md border border-slate-100 dark:border-slate-800/80">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Text Search Input */}
            <div className="md:col-span-5 relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                placeholder="Search doctor by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
            </div>

            {/* Specialization Select */}
            <div className="md:col-span-3">
              <select
                value={specialization}
                onChange={(e) => {
                  setSpecialization(e.target.value);
                  setSearchParams({ specialization: e.target.value });
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec} className="dark:bg-slate-900">
                    {spec === 'All' ? 'All Specialities' : spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Filter */}
            <div className="md:col-span-2">
              <select
                value={minExperience}
                onChange={(e) => setMinExperience(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              >
                <option value="" className="dark:bg-slate-900">Any Experience</option>
                <option value="3" className="dark:bg-slate-900">3+ Years Exp</option>
                <option value="5" className="dark:bg-slate-900">5+ Years Exp</option>
                <option value="10" className="dark:bg-slate-900">10+ Years Exp</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="flex-grow py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="p-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-xl transition-colors"
                title="Clear Filters"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

          </form>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
          <p>Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{doctors.length}</span> doctors</p>
          {(searchQuery || specialization !== 'All' || minExperience) && (
            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Filtered Results</span>
          )}
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <Loader fullScreen={false} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
                  <XCircle className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-lg text-slate-800 dark:text-white">No Doctors Found</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                    Try adjusting your search criteria, selecting another specialization, or clearing filters.
                  </p>
                </div>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default Doctors;
