import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

const toResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profilePicture: user.profilePicture
});

export const register = async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create(req.body);
  res.status(201).json({ user: toResponse(user), token: generateToken(user._id) });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await user.comparePassword(req.body.password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  res.json({ user: toResponse(user), token: generateToken(user._id) });
};

export const getProfile = async (req, res) => {
  res.json({ user: toResponse(req.user) });
};
