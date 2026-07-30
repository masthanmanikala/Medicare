import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

// @desc    Get all doctors (with optional search, specialization, and experience filters)
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (req, res) => {
  try {
    const { search, specialization, minExperience } = req.query;
    let query = {};

    // 1. Filter by search name
    if (search) {
      const users = await User.find({
        role: 'doctor',
        name: { $regex: search, $options: 'i' },
      }).select('_id');
      const userIds = users.map((u) => u._id);
      query.userId = { $in: userIds };
    }

    // 2. Filter by specialization
    if (specialization && specialization !== 'All') {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    // 3. Filter by minimum experience
    if (minExperience) {
      query.experience = { $gte: Number(minExperience) };
    }

    // Fetch doctors and populate User details
    const doctors = await Doctor.find(query).populate({
      path: 'userId',
      select: 'name email phone profileImage role',
    });

    // Filter out any doctor who doesn't have an active user account associated
    const activeDoctors = doctors.filter((doc) => doc.userId !== null);

    res.json({
      success: true,
      count: activeDoctors.length,
      doctors: activeDoctors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get doctor by ID (either User ID or Doctor ID)
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res) => {
  try {
    let doctor = await Doctor.findOne({ userId: req.params.id }).populate({
      path: 'userId',
      select: 'name email phone profileImage role',
    });

    if (!doctor) {
      doctor = await Doctor.findById(req.params.id).populate({
        path: 'userId',
        select: 'name email phone profileImage role',
      });
    }

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    res.json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create doctor profile details (initialization)
// @route   POST /api/doctors
// @access  Private/Doctor
export const createDoctor = async (req, res) => {
  try {
    const { userId, specialization, qualification, experience, hospital, fees, about, availableDays, availableSlots } = req.body;

    // Check if profile already exists
    const profileExists = await Doctor.findOne({ userId });
    if (profileExists) {
      return res.status(400).json({ success: false, message: 'Doctor profile already exists' });
    }

    const doctor = await Doctor.create({
      userId,
      specialization,
      qualification,
      experience,
      hospital,
      fees,
      about,
      availableDays,
      availableSlots,
    });

    res.status(201).json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private/Doctor
export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    doctor.specialization = req.body.specialization || doctor.specialization;
    doctor.qualification = req.body.qualification || doctor.qualification;
    doctor.experience = req.body.experience !== undefined ? Number(req.body.experience) : doctor.experience;
    doctor.hospital = req.body.hospital || doctor.hospital;
    doctor.fees = req.body.fees !== undefined ? Number(req.body.fees) : doctor.fees;
    doctor.about = req.body.about || doctor.about;
    
    if (req.body.availableDays) {
      doctor.availableDays = req.body.availableDays;
    }
    
    if (req.body.availableSlots) {
      doctor.availableSlots = req.body.availableSlots;
    }

    const updatedDoctor = await doctor.save();

    res.json({
      success: true,
      doctor: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
