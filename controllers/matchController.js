import Profile from '../models/Profile.js';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getMatches = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Profile.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User profile not found.' });
    }

    const allUsers = await Profile.find({ userId: { $ne: userId } });

    const userPreferences = JSON.stringify(user.preferences);
    const allProfiles = JSON.stringify(
      allUsers.map((u) => ({
        id: u.userId,
        name: u.name,
        preferences: u.preferences,
      }))
    );

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or gpt-4
      messages: [
        {
          role: 'system',
          content: 'You are an expert roommate matchmaker.',
        },
        {
          role: 'user',
          content: `
          Based on the following user's preferences:
          ${userPreferences}
          
          Match them with these profiles:
          ${allProfiles}
          
          Provide top 3 matches with match percentages and reasoning for each.
          Format the response as:
          {
            "matches": [
              { "id": "user1_id", "name": "User1", "matchPercentage": 85, "reason": "Reason 1" },
              { "id": "user2_id", "name": "User2", "matchPercentage": 70, "reason": "Reason 2" }
            ],
            "reasoning": "Overall reasoning"
          }
          `
        },
      ],
      max_tokens: 600,
    });

    // Parse the AI response
    const aiMatches = JSON.parse(response.choices[0].message.content.trim()).matches;

    // Validate matches against the database
    const validMatches = await Profile.find({
      userId: { $in: aiMatches.map((match) => match.id) },
    });

    // Filter AI matches to keep only valid database matches
    const filteredMatches = aiMatches.filter((match) =>
      validMatches.some((dbUser) => dbUser.userId.toString() === match.id)
    );

    res.status(200).json({ matches: filteredMatches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
