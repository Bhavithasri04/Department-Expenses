import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  designation: { type: String, required: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  employeeId: { type: String, unique: true },
  officeLocation: { type: String },
  department: { type: String },
  
  // These fields are now part of the official model
  role: {
    type: String,
    enum: ['Admin', 'Faculty'],
    default: 'Faculty'
  },
  status: {
    type: String,
    enum: ['Active', 'Disabled'],
    default: 'Active'
  },
  forcePasswordChange: {
    type: Boolean,
    default: false
  },
   assignedBudget: {
      type: Number,
      default: 0
  }
});

export default model('User', UserSchema);
