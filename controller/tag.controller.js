const Tag = require('../model/tag.model')
const Course = require('../model/course.model');
const { ApiError } = require('../utils/ApiError.utils');
const {ApiResponse} = require('../utils/ApiResponse.utils');

//*****create tag*********
exports.createTag = async(req, res) =>{
    try {
        const {title, description} = req.body;
        if(!title || !description){
            throw new ApiError(400,"Fill all the details");
        }

        if(await Tag.find(title)){
            throw new ApiError(400, "Tag Already created");
        }

        await Tag.create({title, description});

        res.status(200).json(
            new ApiResponse(200, "Tag created Successfully")
        )


    } catch (error) {
        throw new ApiError(500, "Failed to created to Tag")
    }
}

//**********get all courses of a tag********
exports.getAllcoursesOfTag = async(req, res) =>{
    try {
        
        const {tag} = req.body;
        if(!tag){
            throw new ApiError(400, "Send the Tag");
        }

        const allCourses = await Tag.find(tag).populate('courses').exec();

        res.status(200).json(
            new ApiResponse(200, "All the courses of the tag", allCourses)
        )

    } catch (error) {
        throw new ApiError(500, "Failed to created to Tag")
    }
}
