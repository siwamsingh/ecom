import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(localFilePath: string): Promise<{success: boolean , imageUrl: string} > {
  try {
    if (!localFilePath) return {success: false, imageUrl:""};

    const fileSize = fs.statSync(localFilePath).size;
    const maxSize = 160 * 1024; // 160 KB in bytes

    if (fileSize > maxSize) {
      fs.unlinkSync(localFilePath); // Delete file if it exceeds the size limit
      console.warn("File size exceeds 160 KB. Skipping upload.");
      return {success: false, imageUrl:""};
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image"
    });

    fs.unlinkSync(localFilePath);

    return {success: true , imageUrl : response.secure_url};
  } catch (error) {
    // Ensure file is deleted in case of an error
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.log(error);
    
    return {success: false , imageUrl : ""};
  }
}

export { uploadToCloudinary };
