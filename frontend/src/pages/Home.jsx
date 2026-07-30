import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doctorService } from '../services/api.js';
import DoctorCard from '../components/DoctorCard.jsx';
import Loader from '../components/Loader.jsx';
import { HeartPulse, ShieldCheck, Zap, Users, Star, ArrowRight, Stethoscope, Activity, Sparkles, Award } from 'lucide-react';

const Home = () => {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedDoctors = async () => {
      try {
        const res = await doctorService.getDoctors();
        if (res.success) {
          // Take the top 3 doctors
          setFeaturedDoctors(res.doctors.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured doctors:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedDoctors();
  }, []);

  const specialities = [
    { name: 'Cardiologist', icon: <Activity className="h-6 w-6 text-rose-500" />, desc: 'Heart Specialists' },
    { name: 'Pediatrician', icon: <Users className="h-6 w-6 text-blue-500" />, desc: 'Child Specialists' },
    { name: 'Dermatologist', icon: <Sparkles className="h-6 w-6 text-amber-500" />, desc: 'Skin & Aesthetics' },
    { name: 'Orthopedist', icon: <Award className="h-6 w-6 text-emerald-500" />, desc: 'Bone Specialists' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-6"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                <HeartPulse className="h-4.5 w-4.5 animate-pulse" />
                Next-Gen Healthcare Booking
              </span>
              
              <h1 className="font-poppins font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-800 dark:text-white leading-tight">
                Book Your Doctor <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Appointment Easily
                </span>
              </h1>
              
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed">
                Connect with top-rated medical practitioners. Browse profiles, check real-time schedule openings, and secure your slot instantly.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/doctors"
                  className="px-6 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center gap-2 group"
                >
                  Find Doctors
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/doctors"
                  className="px-6 py-3.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl text-sm font-semibold transition-colors"
                >
                  Book Appointment
                </Link>
              </div>

              {/* Hero Stats */}
              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-2xl font-extrabold text-slate-800 dark:text-white font-poppins">350+</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Certified Doctors</p>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-slate-800 dark:text-white font-poppins">15k+</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Happy Patients</p>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-slate-800 dark:text-white font-poppins">99.2%</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Satisfaction Rate</p>
                </div>
              </div>
            </motion.div>

            {/* Right Graphics */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-md h-[450px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-tr from-primary to-accent p-1">
                <div className="w-full h-full bg-slate-900/10 dark:bg-slate-900/50 backdrop-blur-sm rounded-[22px] flex items-center justify-center flex-col text-white p-8 text-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 animate-bounce">
                    <Stethoscope className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="font-poppins font-bold text-2xl">Medicare Care Network</h3>
                  <p className="text-sm text-slate-200 leading-relaxed max-w-xs">
                    Leading medical assistance right at your fingertips. Virtual booking and secure healthcare records integrated into a single hub.
                  </p>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. Specialities Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="font-poppins font-extrabold text-3xl text-slate-800 dark:text-white">
              Search by Speciality
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm">
              Find practitioners customized to specific clinical categories. Select below to filter results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialities.map((spec, i) => (
              <motion.div
                key={spec.name}
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate(`/doctors?specialization=${spec.name}`)}
                className="glass-card cursor-pointer p-6 rounded-2xl text-center space-y-4 hover:shadow-lg border border-slate-100 dark:border-slate-800/80 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
                  {spec.icon}
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-slate-800 dark:text-white">{spec.name}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{spec.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Features Trust Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="flex gap-4 p-6 glass-card rounded-2xl bg-white/50 dark:bg-slate-900/40">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0 h-fit">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-poppins font-bold text-slate-800 dark:text-white">Verified Specialists</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Every doctor on our platform is thoroughly vetted with certified state licensing and qualifications check.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 glass-card rounded-2xl bg-white/50 dark:bg-slate-900/40">
              <div className="p-3 bg-accent/10 rounded-xl shrink-0 h-fit">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="font-poppins font-bold text-slate-800 dark:text-white">Instant Approvals</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Say goodbye to wait lists. Real-time booking schedules guarantee slots immediately on completion.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 glass-card rounded-2xl bg-white/50 dark:bg-slate-900/40">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0 h-fit">
                <HeartPulse className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-poppins font-bold text-slate-800 dark:text-white">Patient Centered Care</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Easily record symptoms, consult fees, check clinic maps, and read feedback left by patients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Doctors */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
            <div className="space-y-3">
              <h2 className="font-poppins font-extrabold text-3xl text-slate-800 dark:text-white">
                Our Top Certified Doctors
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
                Meet our highly rated healthcare experts. Review profile histories and select doctor cards.
              </p>
            </div>
            <Link
              to="/doctors"
              className="text-primary hover:text-primary-dark font-semibold text-sm flex items-center gap-1 group shrink-0"
            >
              See All Doctors
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <Loader fullScreen={false} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDoctors.length > 0 ? (
                featuredDoctors.map((doctor) => (
                  <DoctorCard key={doctor._id} doctor={doctor} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-slate-500">
                  No doctor profiles available. Seed data in backend to populate.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
