const User = require("../models/User");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res
      .status(201)
      .json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Set Preferences Controller
exports.setPreferences = async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.preferences = preferences;
    user.profileCreated = true;
    await user.save();
    res.status(200).json({ message: "Preferences saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Matches Controller
exports.getMatches = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const allUsers = await User.find({
      _id: { $ne: userId },
      profileCreated: true,
    });

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Match the user with these preferences: ${JSON.stringify(
        user.preferences
      )} with these users: ${JSON.stringify(
        allUsers.map((u) => u.preferences)
      )}. Provide the best matches.`,
      max_tokens: 200,
    });

    const matches = JSON.parse(response.data.choices[0].text.trim());
    res.status(200).json({ matches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
