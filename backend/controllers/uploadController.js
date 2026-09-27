import { uploadToCloudinary } from '../utils/cloudinary.js';

export const uploadProfilePicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const result = await uploadToCloudinary(req.file.buffer, 'profile_pictures');

  req.user.profilePicture = result.secure_url;
  await req.user.save();

  res.status(201).json({ success: true, fileUrl: result.secure_url });
};
