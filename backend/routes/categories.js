import express from 'express';
import { getCategories, createCategory } from '../controllers/categoryController.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validateZod.js';
import { categorySchema } from '../schemas/categorySchema.js';

const router = express.Router();

router.use(protect);

router.get('/', getCategories);

router.post('/', validate(categorySchema), createCategory);

export default router;
