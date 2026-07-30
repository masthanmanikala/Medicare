import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

// @desc    Get all users (patients and admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['patient', 'admin'] } });
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all doctors (with profiles populated)
// @route   GET /api/admin/doctors
// @access  Private/Admin
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate({
      path: 'userId',
      select: 'name email phone profileImage role',
    });
    res.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete/Block a user
// @route   DELETE /api/admin/user/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'You cannot delete an admin user' });
    }

    // Clean up related profiles/appointments
    if (user.role === 'doctor') {
      await Doctor.findOneAndDelete({ userId: user._id });
      // Cancel doctor appointments
      await Appointment.updateMany({ doctorId: user._id }, { status: 'cancelled' });
    } else {
      // Cancel patient appointments
      await Appointment.updateMany({ patientId: user._id }, { status: 'cancelled' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `User ${user.name} and all related profiles/appointments deleted/blocked`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get system-wide analytics stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAppointments = await Appointment.countDocuments();
    
    // Stats on statuses
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
