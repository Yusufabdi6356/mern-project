import express from 'express';
import { uploadProfilePicture } from '../controllers/uploadController.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

/**
 * @swagger
 * /upload/profile-picture:
 *   post:
 *     summary: Upload a profile picture to Cloudinary
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Returns the Cloudinary file URL
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: No token provided
 */
router.post('/profile-picture', protect, upload.single('file'), uploadProfilePicture);

export default router;
