import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

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

async function deleteFromCloudinary(imageUrl: string): Promise<{ success: boolean, message: string }> {
  try {
    const publicIdMatch = imageUrl.match(/\/([^/]+)\.[\w]+$/);
    if (!publicIdMatch) {
      return { success: false, message: "Invalid image URL" };
    }

    const publicId = publicIdMatch[1]; // Extracted public ID
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to delete image" };
  }
}

export { uploadToCloudinary , deleteFromCloudinary};
