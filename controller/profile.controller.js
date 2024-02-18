const Profile = require('../model/profile.model');
const User = require('../model/user.model');
const { ApiError } = require('../utils/ApiError.utils');
const { ApiResponse } = require('../utils/ApiResponse.utils');
const uploadFileOnCloudinary = require('../utils/uploadFileOnCloudinary.utils')

//update profile section
exports.updateProfile = async(req, res) =>{
    try {
        const {gender, dob, bioData, profession} = req.body;
        const userid = req.user.id;
        if(!gender || !dob || !bioData || !profession || !userid){
            throw new ApiError(400, "fill all the details");
        }

        const profileID = await User.findOne(userid);

        await Profile.findByIdAndUpdate(profileID,
                                    {$push:
                                        {gender:gender, dob:dob, 
                                        bioData:bioData, profession:profession}})
        
        return res.status(200).json(
            new ApiResponse(200, "profile Update")
        )

    } catch (error) {
        throw new ApiError(500, error.message, error)
    }
}

//update profile image
exports.updateProfileImage = async(req, res) =>{
    try {
        const userid = req.user.id;
        const image = req.files.image;
        if(!userid || !image){
            throw new ApiError(400, "Image not found")
        }

        const saveImageOnCloud = await uploadFileOnCloudinary(image, "Profile");

        await User.findByIdAndUpdate(userid, 
                                {$push:{avatar:saveImageOnCloud.secure_url}})
    } catch (error) {
        throw new ApiError(500, error.message, error)
    }
}