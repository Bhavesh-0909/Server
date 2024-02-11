const mongoose = require('mongoose');
const mailSender = require('../utils/nodemailer.utils')

const otpSchema = new mongoose.Schema({
    otp:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: '2m'
    }
});

otpSchema.pre('save', async function(next){
    try {
        const mailResponse = await mailSender(this.email, "You OTP for Verification", this.otp);
        next()
    } catch (error) {
        console.log("Error While Sending Otp", error);
        throw error;
    }
});

module.exports = mongoose.model('Otp', otpSchema)