import Category from '../models/Category.js';

const defaults = [
  { name: 'Salary', type: 'income' },
  { name: 'Freelance', type: 'income' },
  { name: 'Investments', type: 'income' },
  { name: 'Food', type: 'expense' },
  { name: 'Transport', type: 'expense' },
  { name: 'Rent', type: 'expense' },
  { name: 'Utilities', type: 'expense' },
  { name: 'Entertainment', type: 'expense' },
  { name: 'Health', type: 'expense' },
  { name: 'Shopping', type: 'expense' }
];

export const seedCategories = async () => {
  const count = await Category.countDocuments({ user: null });
  if (count === 0) {
    await Category.insertMany(defaults);
    console.log('Default categories created');
  }
};
