const SubSection = require('../model/subSection.model');
const Section = require('../model/section.model');
const uploadFileOnCloudinary = require('../model/section.model');
const { ApiError } = require('../utils/ApiError.utils');
const { ApiResponse } = require('../utils/ApiResponse.utils');

//*******create subsection*******
exports.createSubSection = async(req, res) =>{
    try {

        const {sectionID, title, description, duration} = req.body;
        const videofile = req.files.videoFile;
        if(!sectionID || !title || !description || !duration || !videofile){
            throw new ApiError(400, "fill all the details")
        }

        const videourl = await  uploadFileOnCloudinary(videofile, "Video");

        const subsection = await SubSection.create({title, description, duration, videoUrl:videourl.secure_url});

        await Section.findByIdAndUpdate(sectionID, {$push:{subSection:subsection._id}});

        return res.status(200).json(
            new ApiResponse(200, "subsection created")
        )

    } catch (error) {
        throw new ApiError(500, error.message, error);
    }
}

//*******update subsection******
exports.updateSubSection = async(req, res) =>{
    try {
        
    } catch (error) {
        
    }
}

//*******delete subsection******
exports.deleteSubSection = async(req, res) => {
    try {
        const {sectionID, subSectionID} = req.body;
        if(!sectionID || !subSectionID){
            throw new ApiError(400, "Unable to access to ID's")
        }

        await Section.findByIdAndUpdate(sectionID, {$pull:{subSection:subSectionID}});

        await SubSection.findByIdAndDelete(subSectionID);

        return res.status(200).json(new ApiResponse(200, "subsection deleted"))
        
    } catch (error) {
        throw new ApiError(500, error.message, error)
    }
}