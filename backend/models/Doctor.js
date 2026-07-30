import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please add a specialization'],
      default: 'General Physician',
    },
    qualification: {
      type: String,
      required: [true, 'Please add qualifications'],
      default: 'MBBS',
    },
    experience: {
      type: Number,
      required: [true, 'Please add years of experience'],
      default: 0,
    },
    hospital: {
      type: String,
      required: [true, 'Please add clinic or hospital name'],
      default: 'Medicare Hospital',
    },
    fees: {
      type: Number,
      required: [true, 'Please add consultation fees'],
      default: 500,
    },
    about: {
      type: String,
      default: 'Dedicated medical professional committed to providing excellent patient care.',
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    availableSlots: {
      type: [String],
      default: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
