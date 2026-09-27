import express from 'express';
import { getOverview } from '../controllers/adminController.js';
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';

const router = express.Router();

/**
 * @swagger
 * /admin/overview:
 *   get:
 *     summary: Total users, transactions and top spending categories
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: App overview
 *       403:
 *         description: Access denied
 */
router.get('/overview', protect, authorize('admin'), getOverview);

export default router;
