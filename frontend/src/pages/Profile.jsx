import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Upload, Save, UserCheck, Image } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [imagePreview, setImagePreview] = useState(
    user?.profileImage ? `http://localhost:5000${user.profileImage}` : ''
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return toast.error('Images only! (jpeg, jpg, png, webp)');
      }
      setSelectedFile(file);
      // Create local preview URL
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      return toast.error('Please fill in all details');
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      if (selectedFile) {
        formData.append('profileImage', selectedFile);
      }

      const res = await updateProfile(formData);
      if (res.success) {
        toast.success('Account profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Profile update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto px-4 py-12 min-h-[80vh]"
    >
      <div className="glass-card rounded-3xl p-8 sm:p-10 bg-white/70 dark:bg-slate-900/60 shadow-xl border border-slate-100 dark:border-slate-800">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
            <UserCheck className="h-6 w-6" />
          </div>
          <h2 className="font-poppins font-extrabold text-3xl text-slate-800 dark:text-white">
            My Account Settings
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Modify details and choose a personalized profile picture
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Avatar Upload Container */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800/80">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border-2 border-slate-200 dark:border-slate-700 shrink-0">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-primary" />
              )}
            </div>
            
            <div className="space-y-2 text-center sm:text-left">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-250">Profile Photograph</h4>
              <p className="text-xs text-slate-450 dark:text-slate-500">Supports JPEG, PNG, or WEBP. Max size 5MB.</p>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              
              <button
                type="button"
                onClick={handleUploadClick}
                className="inline-flex items-center gap-1 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload Picture
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/45 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                required
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/45 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/45 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white rounded-2xl font-semibold text-sm transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-2 mt-6"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Account Profile
              </>
            )}
          </button>

        </form>
      </div>
    </motion.div>
  );
};

export default Profile;
