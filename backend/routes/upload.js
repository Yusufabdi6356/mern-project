import express from 'express';
import { uploadProfilePicture } from '../controllers/uploadController.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/profile-picture', protect, upload.single('file'), uploadProfilePicture);

export default router;
