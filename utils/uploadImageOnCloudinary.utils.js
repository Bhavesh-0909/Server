const { ApiError } = require('./ApiError.utils');

const cloudinary = require('cloudinary').v2;

const uploadImageOnCloudinary = async(file, folder, height, quality) => {
    try {
        if(!file || !folder){
            throw new ApiError(400, "file not recived");
        }

        const options = {
            folder,
            resource_type:"auto"
        }

        if(height){
            options.height = height;
        }
        if(quality){
            options.quality = quality;
        }
            
        return await cloudinary.uploader.upload(file.tempFilePath, options);
        
    } catch (error) {
        throw new ApiError(500, "failed to upload Image")
    }
}

module.exports = uploadImageOnCloudinary;