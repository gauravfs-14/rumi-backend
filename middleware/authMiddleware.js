import jwt from 'jsonwebtoken';

export const protect =(req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  const loggedIn = jwt.verify(token, process.env.JWT_SECRET);
  if (!loggedIn) return res.status(401).json({ message: "Unauthorized" });
  req.user = loggedIn._id;
  next();
};
