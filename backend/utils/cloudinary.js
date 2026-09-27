import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) {
        const uploadError = new Error(error.message || 'Upload to Cloudinary failed');
        uploadError.statusCode = 502;
        return reject(uploadError);
      }
      resolve(result);
    });
    stream.end(buffer);
  });
};

export default cloudinary;
