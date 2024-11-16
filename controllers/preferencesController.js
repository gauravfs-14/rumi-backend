import Profile from '../models/Profile.js';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateUserProfile = async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body; // Expecting updated profile data
  
      const profile = await Profile.findOneAndUpdate({ userId }, updates, { new: true });
      if (!profile) return res.status(404).json({ message: 'Profile not found' });
  
      res.status(200).json({ message: 'Profile updated successfully', profile });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
  export const updatePreferences = async (req, res) => {
    try {
      const { userId } = req.params;
      const { preferences } = req.body;
  
      const profile = await Profile.findOne({ userId });
      if (!profile) return res.status(404).json({ message: 'Profile not found' });
  
      profile.preferences = preferences;
      await profile.save();
  
      res.status(200).json({ message: 'Preferences updated successfully', preferences: profile.preferences });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
  export const isProfileCompleted = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const profile = await Profile.findOne({ userId });
      if (!profile) return res.status(404).json({ message: 'Profile not found' });
  
      const isCompleted = !!profile.name && !!profile.location && !!profile.preferences.length;
      res.status(200).json({ profileCompleted: isCompleted });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


export const getMatches = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Profile.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User profile not found' });

    const allUsers = await Profile.find({ userId: { $ne: userId } });

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `
      Match this user's preferences:
      ${JSON.stringify(user.preferences)} 
      with these profiles:
      ${JSON.stringify(allUsers.map((u) => ({
        id: u.userId,
        name: u.name,
        preferences: u.preferences,
      })))}
      Return matches in JSON format with match percentages and reasons.
      `,
      max_tokens: 300,
    });

    const matches = JSON.parse(response.data.choices[0].text.trim());
    res.status(200).json({ matches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
