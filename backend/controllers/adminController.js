import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const getOverview = async (req, res) => {
  const [totalUsers, totalTransactions, totals, topSpendingCategories] = await Promise.all([
    User.countDocuments(),
    Transaction.countDocuments(),
    Transaction.aggregate([
      { $group: { _id: '$type', total: { $sum: { $abs: '$amount' } } } }
    ]),
    Transaction.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: { $abs: '$amount' } }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, category: '$_id', total: 1, count: 1 } }
    ])
  ]);

  const totalIncome = totals.find(item => item._id === 'income')?.total || 0;
  const totalExpense = totals.find(item => item._id === 'expense')?.total || 0;

  res.json({
    totalUsers,
    totalTransactions,
    totalIncome,
    totalExpense,
    topSpendingCategories
  });
};
