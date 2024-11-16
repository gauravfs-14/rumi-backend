import Profile from '../models/Profile.js';

export const createUserProfile = async (req, res) => {
  try {
    const { name, photo, shortBio, socialLinks, location, major, university, preferences } = req.body;

    // Fetch userId and email from req.user (provided by the protect middleware)
    const userId = req.user.id;
    const email = req.user.email;

    // Validate input
    if (!name || !location || !major || !university || !preferences) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if profile already exists for the user
    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists for this user' });
    }

    // Create and save the profile
    const profile = new Profile({
      userId,
      email,
      name,
      photo,
      shortBio,
      socialLinks,
      location,
      major,
      university,
      preferences,
    });

    await profile.save();

    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
