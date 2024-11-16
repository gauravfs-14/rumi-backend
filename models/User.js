import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    type: Map,
    of: Boolean,
  },
  profileCreated: { type: Boolean, default: false },
});

const User = mongoose.model('User', UserSchema);
export default User;
