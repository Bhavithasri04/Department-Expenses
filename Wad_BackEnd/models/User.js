import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  designation: { type: String, required: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
});

export default model('User', UserSchema);
