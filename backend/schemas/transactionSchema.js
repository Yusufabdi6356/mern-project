import { z } from 'zod';

export const transactionSchema = z.object({
  title: z.string('Title is required').trim().min(1, 'Title is required'),
  amount: z.number('Amount must be a number').refine(value => value !== 0, 'Amount cannot be zero'),
  type: z.enum(['income', 'expense'], 'Type must be income or expense'),
  category: z.string('Category is required').trim().min(1, 'Category is required'),
  date: z.iso.date('Date must be in YYYY-MM-DD format').optional()
});

export const updateTransactionSchema = transactionSchema
  .partial()
  .refine(data => Object.keys(data).length > 0, 'Provide at least one field to update');
