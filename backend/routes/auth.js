import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validateZod.js';
import { registerSchema, loginSchema } from '../schemas/userSchema.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);

router.post('/login', validate(loginSchema), login);

router.get('/profile', protect, getProfile);

export default router;
