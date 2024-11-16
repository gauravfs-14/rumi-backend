import User from '../models/User.js';  // Adjust path as necessary
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Signup Controller
export const signup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    //validation
    if (!name || !email || !password || !confirmPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    //create a new user
    const savedUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    return res.json({
      user: {
        name: savedUser.name,
        email: savedUser.email,
      },
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
  if (!token) return res.send(false);
  const loggedIn = jwt.verify(token, process.env.JWT_SECRET);
  if (!loggedIn) return res.send(false);
  return res.send(true);
}