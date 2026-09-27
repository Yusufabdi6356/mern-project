import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string('Name is required').trim().min(1, 'Name is required'),
  type: z.enum(['income', 'expense'], 'Type must be income or expense')
});
