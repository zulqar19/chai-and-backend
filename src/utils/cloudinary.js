import {v2 as cloudinary} from "cloudinary"
import { log } from "console";
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_API_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {resource_type : "auto"});
        fs.unlinkSync(localFilePath)        
        return response
        
    } catch (error) {
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        console.log("Cloudinary upload error " , error);
        
        return null;
    }
} 

const deleteFromCloudinary = async (publicId) => {
    try {
      if (!publicId) return;
  
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error("Cloudinary deletion error:", error);
      return null;
    }
  };

const detailsFromCloudinary = async (publicId) => {
  try {
    if(!publicId) return;
    const result = await cloudinary.api.resource(publicId , {
      resource_type : "video"
    })

    log(result?.duration, "Cloudinary console")
    return result?.duration
  } catch (error) {
    console.error("Cloudinary details fetch error: " , error)
    return null
  }
}


export {uploadOnCloudinary , deleteFromCloudinary , detailsFromCloudinary}