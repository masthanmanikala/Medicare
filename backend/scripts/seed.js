import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await Doctor.deleteMany();
    await Appointment.deleteMany();
    console.log('Existing Database Cleared.');

    // 1. Create Admins
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@medicare.com',
      password: 'password123',
      phone: '1234567890',
      role: 'admin',
      profileImage: '',
    });
    console.log('Admin Seeding Completed.');

    // 2. Create Patients
    const patient1 = await User.create({
      name: 'John Doe',
      email: 'patient@medicare.com',
      password: 'password123',
      phone: '9876543210',
      role: 'patient',
      profileImage: '',
    });
    console.log('Patient Seeding Completed.');

    // 3. Create Doctor Users
    const docUser1 = await User.create({
      name: 'Dr. Sarah Connor',
      email: 'sarah@medicare.com',
      password: 'password123',
      phone: '5551112222',
      role: 'doctor',
      profileImage: '',
    });

    const docUser2 = await User.create({
      name: 'Dr. Alex Karev',
      email: 'alex@medicare.com',
      password: 'password123',
      phone: '5553334444',
      role: 'doctor',
      profileImage: '',
    });

    const docUser3 = await User.create({
      name: 'Dr. Meredith Grey',
      email: 'meredith@medicare.com',
      password: 'password123',
      phone: '5555556666',
      role: 'doctor',
      profileImage: '',
    });
    console.log('Doctor User Accounts Seeding Completed.');

    // 4. Create Doctor Profile details
    await Doctor.create([
      {
        userId: docUser1._id,
        specialization: 'Cardiologist',
        qualification: 'MD, DM - Cardiology',
        experience: 12,
        hospital: 'Metro Heart Institute',
        fees: 800,
        about: 'Dr. Sarah Connor is a senior consultant cardiologist with over 12 years of experience. She specializes in preventive cardiology and interventional procedures.',
        rating: 4.8,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
      },
      {
        userId: docUser2._id,
        specialization: 'Pediatrician',
        qualification: 'MBBS, MD - Pediatrics',
        experience: 8,
        hospital: 'St. Jude Children Hospital',
        fees: 600,
        about: 'Dr. Alex Karev is a passionate pediatrician committed to child care and pediatric nutrition. He has 8 years of experience working with infants and children.',
        rating: 4.7,
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        availableSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
      },
      {
        userId: docUser3._id,
        specialization: 'Dermatologist',
        qualification: 'MBBS, DVD - Dermatology',
        experience: 10,
        hospital: 'Skin & Aesthetics Center',
        fees: 700,
        about: 'Dr. Meredith Grey specializes in clinical dermatology and aesthetic skin treatments. She is highly experienced in treating complex skin conditions.',
        rating: 4.9,
        availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
        availableSlots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'],
      },
    ]);
    console.log('Doctor Profiles Seeding Completed.');

    console.log('Database Seeding Successful!');
    process.exit();
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
