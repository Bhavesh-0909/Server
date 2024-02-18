const Category = require('../model/category.model')
const { ApiError } = require('../utils/ApiError.utils');
const {ApiResponse} = require('../utils/ApiResponse.utils');

//*****create category*********
exports.createCategory = async(req, res) =>{
    try {
        const {title, description} = req.body;
        if(!title || !description){
            throw new ApiError(400,"Fill all the details");
        }

        if(await Category.find(title)){
            throw new ApiError(400, "Tag Already created");
        }

        await Category.create({title, description});

        return res.status(200).json(
            new ApiResponse(200, "Tag created Successfully")
        )


    } catch (error) {
        throw new ApiError(500, error.message, error)
    }
}

//**********get all courses of a category********
exports.getAllcoursesOfCategory = async(req, res) =>{
    try {

        const {category} = req.body;
        if(!category){
            throw new ApiError(400, "Send the Tag");
        }

        const allCourses = await Category.find({title:category}).populate('courses').exec();

        res.status(200).json(
            new ApiResponse(200, "All the courses of the tag", allCourses)
        )

    } catch (error) {
        throw new ApiError(500, error.message, error)
    }
}
