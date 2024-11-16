import User from '../models/User.js';  // Adjust path as necessary
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Signup Controller
export const signup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user
    const savedUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set cookie and respond
    return res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookie in production
        sameSite: 'strict',
      })
      .json({
        user: {
          name: savedUser.name,
          email: savedUser.email,
        },
        message: 'Signup successful, logged in automatically.',
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //validation
    if (!email || !password)
      return res.status(400).json({ message: "Invalid credentials" });

    const existingUser = await User.findOne({ email: email });

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    //generate jwt token
    const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export const logout = (req, res) => {
  //reset cookies
  return res
    .cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
    })
    .send();
}

export const status = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ authenticated: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select('_id name email');
    if (!user) {
      return res.json({ authenticated: false });
    }

    return res.json({
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.json({ authenticated: false });
  }
};
