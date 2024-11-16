import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Assuming you have a User model

const protect = async (req, res, next) => {
  const token = req.cookies.token; // Extract token from cookies

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, token missing' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user data from the database
    const user = await User.findById(decoded._id).select('email _id'); // Select only necessary fields
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized, user not found' });
    }

    req.user = {
      id: user._id,
      email: user.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized, token invalid' });
  }
};

export default protect;
