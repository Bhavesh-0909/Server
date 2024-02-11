const User = require('../model/user.model');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const Otp = require('../model/otp.model')
const {ApiError} = require('../utils/ApiError.utils');
const {ApiResponse} = require('../utils/ApiResponse.utils')

//*****Send Verification******* 
exports.sendVerificationController = async(req, res) => {
    try {
        const {email} = req.body;

        if(!email) {
            throw new ApiError(400, "User Already Register");
        } 

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
            digits:true
        });

        if(!otp){
            throw new ApiError(400, "Otp was not generator")
        }

        const otpPlayload = {otp, email};

        await Otp.create(otpPlayload);

        return res.status(200).json(
            new ApiResponse(200, "Otp Generated")
        )
    

    } catch (error) {
        throw new ApiError(500, "Error while otp generation")
    }
}

//********Sign Up*******
exports.signupController = async(req, res) =>{
    try {
        const {firstName, lastName, 
            email, accountType, otp,
            contactNo, password, confirmPassword} = req.body;

        if(!firstName || !lastName || !email || !password || !confirmPassword){
            throw new ApiError(400, "Fill all the feilds for Sign Up")
        }

        if(password !== confirmPassword ) throw new ApiError(400, "Password not Matching");

        const extingUser = await User.findOne({email});
        if(extingUser){
            throw new ApiError(400, "User Already extist")
        }

        const recentOtp = await Otp.find({email}).sort({createdAt:-1}).limit(1);
        if(!recentOtp){
            throw new ApiError(400, "Otp Expired")
        }else if(otp !== recentOtp){
            throw new ApiError(400, "Otp did not Match")
        }

        

    } catch (error) {
        
    }
}

//*********Login*********
exports.loginController = async(req, res) =>{
    try {
        
    } catch (error) {
        
    }
}