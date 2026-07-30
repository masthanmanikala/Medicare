import express from 'express';
import {
  getAllUsers,
  getAllDoctors,
  deleteUser,
  getStats,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Secure all routes in this file to admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/doctors', getAllDoctors);
router.get('/stats', getStats);
router.delete('/user/:id', deleteUser);

export default router;
