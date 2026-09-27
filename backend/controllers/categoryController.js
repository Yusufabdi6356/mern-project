import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  const categories = await Category.find({
    $or: [{ user: null }, { user: req.user._id }]
  }).sort({ type: 1, name: 1 });

  res.json(categories);
};

export const createCategory = async (req, res) => {
  const exists = await Category.findOne({
    name: req.body.name,
    $or: [{ user: null }, { user: req.user._id }]
  });

  if (exists) {
    return res.status(409).json({ success: false, message: 'Category already exists' });
  }

  const category = await Category.create({ ...req.body, user: req.user._id });
  res.status(201).json(category);
};
