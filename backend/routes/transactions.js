import express from 'express';
import {
  createTransaction,
  getTransactions,
  getMonthlySummary,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionController.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validateZod.js';
import { transactionSchema, updateTransactionSchema } from '../schemas/transactionSchema.js';

const router = express.Router();

router.use(protect);

router.post('/', validate(transactionSchema), createTransaction);

router.get('/', getTransactions);

router.get('/monthly-summary', getMonthlySummary);

router.put('/:id', validate(updateTransactionSchema), updateTransaction);

router.delete('/:id', deleteTransaction);

export default router;
