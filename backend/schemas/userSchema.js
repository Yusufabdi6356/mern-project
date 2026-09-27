import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string('Name is required').trim().min(1, 'Name is required'),
  email: z.email('Email must be valid'),
  password: z
    .string('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include at least one uppercase letter')
    .regex(/[a-z]/, 'Must include at least one lowercase letter')
    .regex(/[0-9]/, 'Must include at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must include at least one special character')
});

export const loginSchema = z.object({
  email: z.email('Email must be valid'),
  password: z.string('Password is required').min(1, 'Password is required')
});
