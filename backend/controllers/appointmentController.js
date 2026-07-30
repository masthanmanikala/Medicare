import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private/Patient
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, symptoms } = req.body;

    // Verify doctor exists
    const doctorExists = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctorExists) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Verify patient isn't booking with themselves
    if (req.user._id.toString() === doctorId) {
      return res.status(400).json({ success: false, message: 'You cannot book an appointment with yourself' });
    }

    // Double booking check: Check if doctor already has a pending or confirmed booking for that date/time
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This doctor is already booked for the selected time slot. Please choose another slot or date.',
      });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date,
      time,
      symptoms,
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user appointments (Patient/Doctor specific, or all for Admin)
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    } // Admin sees all

    const appointments = await Appointment.find(query)
      .populate({
        path: 'patientId',
        select: 'name email phone profileImage',
      })
      .populate({
        path: 'doctorId',
        select: 'name email phone profileImage',
      })
      .sort({ createdAt: -1 });

    // Since we also want the doctor profile details (fees, specialization, etc.)
    // We can fetch doctor details manually or map them
    const enrichedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const appointmentObj = appointment.toObject();
        if (appointment.doctorId) {
          const docProfile = await Doctor.findOne({ userId: appointment.doctorId._id });
          appointmentObj.doctorProfile = docProfile;
        }
        return appointmentObj;
      })
    );

    res.json({
      success: true,
      count: enrichedAppointments.length,
      appointments: enrichedAppointments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Role-based status change controls
    const isPatient = req.user.role === 'patient' && appointment.patientId.toString() === req.user._id.toString();
    const isDoctor = req.user.role === 'doctor' && appointment.doctorId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment status',
      });
    }

    // Patients can ONLY cancel
    if (isPatient && status !== 'cancelled') {
      return res.status(403).json({
        success: false,
        message: 'Patients are only permitted to cancel appointments',
      });
    }

    appointment.status = status;
    await appointment.save();

    const updatedAppointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email phone profileImage')
      .populate('doctorId', 'name email phone profileImage');

    res.json({
      success: true,
      message: `Appointment status updated to ${status}`,
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
