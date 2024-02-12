const { ApiError } = require("../utils/ApiError.utils")
const User = require('../model/user.model');
const mailSender = require("../utils/nodemailer.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const bcrypt = require('bcrypt');

//reset password token
exports.resetPasswordToken = async(req, res) => {
    try {
        const {email} = req.body;
        if(!email){
            throw new ApiError(400, "Give the Email")
        }

        const user = await User.findOne({email});
        if(!user){
            throw new ApiError(400, "user not found")
        }

        const token = crypto.randomUUID()

        user.token = token;
        user.resetPasswordExp = Date.now() + 5*60*60*1000;
        const saveToken = await user.save();

        const url = `http://localhost:4000/resetPassword/${token}`

        const mailResponse = await mailSender(email, "Link for reseting password", url)

        res.status(200).json(
            new ApiResponse(200, "Mail send")
        )

    } catch (error) {
        throw new ApiError(500, error.message, error);
    }
}


//reset password
exports.resetPassword = async(req, res) => {
    try {

        const {newPassword, confirmPassword, token} = req.body;
        if(!token || !newPassword || !confirmPassword){
            throw new ApiError(400, "fill All the fields")
        }

        if(newPassword !== confirmPassword) {
            throw new ApiError(400, "Password not matched")
        }

        const user = await User.findOne({token});
        if(!user){
            throw new ApiError(400, "Reset Password time up, Retry")
        }

        const hashpassword = bcrypt.hash(newPassword, process.env.HASHING_ROUND);

        user.password = hashpassword;
        const savePassword = await user.save();

        return res.status(200).json(
            new ApiResponse(200, "Password changed")
        )

    } catch (error) {
        throw new ApiError(500, error.message, error);
    }
}