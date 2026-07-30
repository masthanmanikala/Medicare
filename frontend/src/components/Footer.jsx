import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-slate-950 border-t border-slate-800 pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <HeartPulse className="h-6 w-6 text-primary" />
              </div>
              <span className="font-poppins font-bold text-xl tracking-tight text-white">
                Medicare
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Book appointments with certified healthcare specialists in just a few clicks. Your health is our priority.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-poppins font-semibold text-sm tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-primary transition-colors flex items-center gap-1">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary transition-colors flex items-center gap-1">
                  Register Account
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                  About Us <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Specialities */}
          <div>
            <h3 className="text-white font-poppins font-semibold text-sm tracking-wider uppercase mb-4">
              Specialities
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/doctors?specialization=Cardiologist" className="hover:text-primary transition-colors">
                  Cardiology
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialization=Pediatrician" className="hover:text-primary transition-colors">
                  Pediatrics
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialization=Dermatologist" className="hover:text-primary transition-colors">
                  Dermatology
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialization=Orthopedist" className="hover:text-primary transition-colors">
                  Orthopedics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <h3 className="text-white font-poppins font-semibold text-sm tracking-wider uppercase mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>Korlagunta , Leela Mahal, Tirupati.</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+91 8328428506</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>medicare@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Medicare Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
