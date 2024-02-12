const User = require('../model/user.model');
const otpGenerator = require('otp-generator');
const Otp = require('../model/otp.model')
const {ApiError} = require('../utils/ApiError.utils');
const {ApiResponse} = require('../utils/ApiResponse.utils');
require('dotenv').config();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const mailsender = require('../utils/nodemailer.utils')
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
        throw new ApiError(500, error.message, error)
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

        const recentOtp = await Otp.find({email}).sort({createdAt:-1}).limit(1);
        if(!recentOtp){
            throw new ApiError(400, "Otp Expired")
        }else if(otp !== recentOtp){
            throw new ApiError(400, "Otp did not Match")
        }

        if(password !== confirmPassword ){
            throw new ApiError(400, "Password not Matching");
        }

        const extingUser = await User.findOne({email});
        if(extingUser){
            throw new ApiError(400, "User Already extist")
        }

        const user = await User.create({
            firstName, lastName, email,
            password, contactNo, accountType,
        })

        return res.status(200).json(
            new ApiResponse(200, "User Signup completed", user)
        )
        
    } catch (error) {
        throw new ApiError(500, error.message, error)
    }
}

//*********Login*********
exports.loginController = async(req, res) =>{
    try {
        const {email, password} = req.body;

        if(!email || !password){
            throw new ApiError(400, "Fill all the feilds");
        }

        const user = await User.findOne({email});
        if(!user){
            throw new ApiError(400, "User does not exits");
        }

        const isPasswordValid = user.isPasswordCorrect(password)
        if(!isPasswordValid){
            throw new ApiError(400, "Incorrect Password");
        }

        const playload = {
            email:user.password,
            id:user._id,
            accountType:user.accountType
        }

        const token = jwt.sign(playload, process.env.JWT_SECRET, {expiresIn:'2h'})

        user.token = token;
        user.password = undefined;

        const options = {
            expiresIn: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true
        };

        res.cookie("token", token, options).status(200).json(
            new ApiResponse(200, "user Logined", {token, user})
        )

    } catch (error) {
        throw new ApiError(500, error.message, error)
    }
}

//*********Change Password********

exports.changePasswordController = async(req, res) => {
    try {
        const {currentPassword, newPassword, confirmPassword} = req.body;
        const {email} = req.cookie.email;
        if(!currentPassword || !newPassword || !confirmPassword){
            throw new ApiError(400, "Fill all the fields");
        }else if(!email){
            throw new ApiError(400, "Please Login to change password")
        }

        if(newPassword !== confirmPassword){
            throw new ApiError(400, "Password not matching");
        }

        const user = await User.findOne({email});
        if(!user){
            throw new ApiError(400, "User not Found");
        }

        const isPasswordValid = await User.isPasswordCorrect(currentPassword);
        if(!isPasswordValid){
            throw new ApiError(400, "Wrong Password");
        }

        const hashpassword = bcrypt.hash(newPassword, process.env.HASHING_ROUND);

        user.password = hashpassword;

        const savePassword = await user.save();

        await mailsender(email, "Password changed Successfully", "password changed");

        return res.status(200).json(
            new ApiResponse(200, "Password Changed")
        )

    } catch (error) {
        throw new ApiError(500, error.message, error)
    }
    


}