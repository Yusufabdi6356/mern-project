import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';

const signedAmount = (amount, type) => {
  return type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
};

const categoryExists = (name, type, userId) => {
  return Category.exists({ name, type, $or: [{ user: null }, { user: userId }] });
};

const invalidCategory = (res, type) => {
  return res.status(400).json({ success: false, message: `Pick one of your ${type} categories` });
};

export const createTransaction = async (req, res) => {
  if (!(await categoryExists(req.body.category, req.body.type, req.user._id))) {
    return invalidCategory(res, req.body.type);
  }

  const transaction = await Transaction.create({
    ...req.body,
    amount: signedAmount(req.body.amount, req.body.type),
    user: req.user._id
  });

  res.status(201).json(transaction);
};

export const getTransactions = async (req, res) => {
  const filter = { user: req.user._id };

  if (req.query.type) filter.type = req.query.type;
  if (req.query.category) filter.category = req.query.category;

  const transactions = await Transaction.find(filter).sort({ date: -1 });
  res.json({ count: transactions.length, transactions });
};

export const getMonthlySummary = async (req, res) => {
  const now = new Date();
  const month = req.query.month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return res.status(400).json({ success: false, message: 'Month must be in YYYY-MM format' });
  }

  const [year, monthNumber] = month.split('-').map(Number);
  const start = new Date(Date.UTC(year, monthNumber - 1, 1));
  const end = new Date(Date.UTC(year, monthNumber, 1));

  const categories = await Transaction.aggregate([
    { $match: { user: req.user._id, date: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: { category: '$category', type: '$type' },
        total: { $sum: { $abs: '$amount' } },
        count: { $sum: 1 }
      }
    },
    { $project: { _id: 0, category: '$_id.category', type: '$_id.type', total: 1, count: 1 } },
    { $sort: { total: -1 } }
  ]);

  const totalIncome = categories
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.total, 0);

  const totalExpense = categories
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.total, 0);

  res.json({
    month,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    categories
  });
};

export const updateTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });

  if (!transaction) {
    return res.status(404).json({ success: false, message: 'Transaction not found' });
  }

  Object.assign(transaction, req.body);

  if (!(await categoryExists(transaction.category, transaction.type, req.user._id))) {
    return invalidCategory(res, transaction.type);
  }

  transaction.amount = signedAmount(transaction.amount, transaction.type);
  await transaction.save();

  res.json(transaction);
};

export const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!transaction) {
    return res.status(404).json({ success: false, message: 'Transaction not found' });
  }

  res.json({ message: 'Transaction deleted' });
};
