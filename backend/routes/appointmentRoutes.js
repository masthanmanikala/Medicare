import express from 'express';
import {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, bookAppointment);
router.get('/', protect, getAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);

export default router;
