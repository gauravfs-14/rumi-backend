import mongoose from 'mongoose';

const socialLinksSchema = new mongoose.Schema({
  linkedin: { type: String, default: '' },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  telephone: { type: String, default: '' },
  discord: { type: String, default: '' },
});

const preferencesSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: Boolean, required: true },
});

const locationSchema = new mongoose.Schema({
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
});

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  photo: { type: String, default: '' }, // URL for the profile photo
  shortBio: { type: String, default: '' },
  socialLinks: { type: socialLinksSchema, default: () => ({}) },
  location: { type: locationSchema, required: true },
  major: { type: String, required: true },
  university: { type: String, required: true },
  preferences: [preferencesSchema], // Array of question-answer pairs
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
