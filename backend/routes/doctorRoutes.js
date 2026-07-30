import express from 'express';
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctorProfile,
} from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post('/', protect, authorize('doctor', 'admin'), createDoctor);

// Support both PUT /profile and PUT /:id (so doctors can update via /profile, or PUT /:id can be invoked by doctor/admin)
router.put('/profile', protect, authorize('doctor'), updateDoctorProfile);
router.put('/:id', protect, authorize('doctor', 'admin'), async (req, res, next) => {
  // If user is doctor, make sure they only update their own profile, unless they are admin
  if (req.user.role === 'doctor' && req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });
  }
  // Mock request.user._id to req.params.id so updateDoctorProfile can work
  req.user._id = req.params.id;
  return updateDoctorProfile(req, res, next);
});

export default router;
