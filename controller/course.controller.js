const Course = require('../model/course.model');
const Tag = require('../model/tag.model');
const { ApiError } = require('../utils/ApiError.utils');
const {ApiResponse} = require('../utils/ApiResponse.utils')
const uploadImageOnCloudinary = require('../utils/uploadImageOnCloudinary.utils');

//*******create A course********
exports.createCourse = async(req, res) => {
    try {
        const {courseName, courseDesc, price, whatWillYouLearn, tag} = req.body;
        const thumbnail = req.files.thumbnail;
        const insturctorID = req.user._id;

        if(!courseName || !courseDesc || !price || !whatWillYouLearn || !tag || !thumbnail){
            throw new ApiError(400, "Fill all the fileds")
        }
        if(!insturctorID){
            throw new ApiError(400, "please Login");
        }

        const thumbnailURL = await uploadImageOnCloudinary(thumbnail, process.env.FOLDER_NAME);
        if(!thumbnailURL){
            throw new ApiError(400, "failed to upload file ");
        }

        const courseDetail = await Course.create({
            courseName, courseDesc, price, whatWillYouLearn, tag,
            insturctor:insturctorID, thumbnail:thumbnailURL.secure_url
        },{new:true})

        await Tag.findOneAndUpdate({title:tag},
            {$push:{courses:courseDetail._id}})

        return res.status(200).json(
            new ApiResponse(200, "course created", courseDetail)
        )

    } catch (error) {
        throw new ApiError(500, error.message, error)
    }
}

//*******get all courses********
exports.getAllCourse = async(req, res) =>{
    try {
        
    } catch (error) {
        throw new ApiError(500, error.message, error)
    }
}