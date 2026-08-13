import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary variables lazily or gracefully with silent mock fallbacks
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

let isCloudinaryConfigured = false;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
  isCloudinaryConfigured = true;
}

/**
 * Generates a signed upload policy signature to allow secure, direct uploads from the browser
 * directly to Cloudinary without flooding the core backend thread.
 */
export const getCloudinarySignature = (folder: string = 'shopsphere_products') => {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary credentials are not configured in system environment variables.');
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = {
    timestamp,
    folder
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret!);

  return {
    signature,
    timestamp,
    cloudName,
    apiKey,
    folder
  };
};

/**
 * Proxy function to upload raw base64 data directly from the server side
 */
export const uploadToServerSideCloudinary = async (base64Image: string, folder: string = 'shopsphere_products'): Promise<string> => {
  if (!isCloudinaryConfigured) {
    // Graceful fallback for demo or key-less dry-run environments so start/compile doesn't break
    console.warn('Cloudinary not configured. Returning fallback Unsplash mock image.');
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80';
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder,
      resource_type: 'auto'
    });
    return uploadResponse.secure_url;
  } catch (error: any) {
    console.error('Cloudinary Direct Upload Error:', error);
    throw new Error(`Failed to upload to Cloudinary: ${error.message || error}`);
  }
};

export default cloudinary;
