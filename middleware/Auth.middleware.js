const { ApiError } = require("../utils/ApiError.utils")

//auth
exports.auth = async(req, res, next) =>{
    try {
        const token = req.cookie.token || req.headers['authorization'].replace("Bearer ", "");
        if(!token){
            throw new ApiError(400, "Please Login");
        }

        try {
            const data = jwt.verify(token, process.env.JWT_SECRET)
            req.user = data;
            next()
        } catch (error) {
            throw new ApiError(500, "User did not verified")
        }

    } catch (error) {
        throw new ApiError(500, "failed to authonticate")
    }
}

//isStudent
exports.isStudent = (req, res, next)=>{
    try {

        const accountType = req.user.accountType;
        if(accountType !== "Student") {
            throw new ApiError(400, "This route is for student you are not allowed");
        } 
        next()

    } catch (error) {
        throw new ApiError(500, error.message, error)
    }
}

//isAdmin
exports.isAdmin = (req, res, next)=>{
    try {

        const accountType = req.user.accountType;
        if(accountType !== "Admin") {
            throw new ApiError(400, "This route is for Admin you are not allowed");
        } 
        next()

    } catch (error) {
        throw new ApiError(500, error.message, error)
    }
}

//isInstructor
exports.isInstructor = (req, res, next)=>{
    try {

        const accountType = req.user.accountType;
        if(accountType !== "Instructor") {
            throw new ApiError(400, "This route is for instructor you are not allowed");
        } 
        next()

    } catch (error) {
        throw new ApiError(500, error.message, error)
    }
}