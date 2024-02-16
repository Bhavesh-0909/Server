const { ApiError } = require("../utils/ApiError.utils");
const Section = require('../model/section.model');
const Course = require('../model/course.model');
const { ApiResponse } = require("../utils/ApiResponse.utils");

//******create section ********
exports.createSection = async(req, res)=>{
    try {
        const {courseId, title} = req.body;
        if(!courseId || !title){
            throw new ApiError(400, "Fill all the detailes");
        }

        const section = await Section.create({title});
        
        await Course.findByIdAndUpdate(courseId, {$push:{courseContent:section._id}});

        return res.status(200).json(
            new ApiResponse(200, "section created")
        )
    } catch (error) {
        throw new ApiError(500, error.message, error)
    }
}

//******update section ********
exports.updateSection = async(req, res)=>{
    try {
        const {sectionId, title} = req.body;
        if(!sectionId || !title){
            throw new ApiError(400, "Fill all the detailes");
        }

        await Section.findByIdAndUpdate({title});

        return res.status(200).json(
            new ApiResponse(200, "section updated")
        )
        
    } catch (error) {
        throw new ApiError(500, error.message, error)
    }
}
