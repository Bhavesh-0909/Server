const {instance} = require('../utils/Razorpay.utils');
const User = require('../model/user.model');
const Course = require('../model/course.model');
const mailsender = require('../utils/nodemailer.utils');
const {ApiError} = require('../utils/ApiError.utils')
const {ApiResponse} = require('../utils/ApiResponse.utils');
const { default: mongoose } = require('mongoose');

//***********capture payment************
exports.capturePayment = async (req, res) => {
    try {
        const courseID = req.body.courseID;
        const userID = req.user.id;
        if(!courseID || !userID){
            throw new ApiError(400, "User and Course did not found");
        }

        const course = await Course.findById(courseID);
        const ObjUserID = mongoose.Types.ObjectId(userID);
        if(course.studentEnrolled.includes(ObjUserID)){
            throw new ApiError(400, "user Already bought the course")
        }

        const amount = course.price * 100;
        const currency = "INR";
        const options = {
            amount, 
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes:{
                userID,
                courseID
            }
        }

        try {
            const paymentResponse = await instance.orders.create(options);
        } catch (error) {
            throw new ApiError(500, error.message, error);
        }

        const data = {
            courseName: course.courseName,
            courseDesc: course.courseDesc,
            courseThumbnail: course.thumbnail,
            orderID: paymentResponse.id,
            amount: paymentResponse.amount,
            currency: paymentResponse.currency,
        }

        return res.status(200).json(
            new ApiResponse(200, "Payment created", data)
        )

    } catch (error) {
        throw new ApiError(500, error.message, error)
    }
}

//********verify Signature and do action*******
exports.verifySignature = async (req, res) => {
    try {
        const webhook = process.env.RAZORPAY_WEBHOOK;
        const signature = req.headers['x-razorpay-signature'];

        const shasum = crypto.createHmac('sha256', webhook);

        shasum.update(JSON.stringify(req.body));

        const digest = shasum.digest('hex');

        if(signature !== digest){
            throw new ApiError(400, "Payment Didnt authorized");
        }

        const {userID, courseID} = req.body.playload.payment.entity.notes;

        const userResponse = await User.findByIdAndUpdate(userID,
                                        {$push:{courses:courseID}},
                                        {new:true});
        if(!userResponse){
            throw new ApiError(400, "User not found")
        }
        
        const courseResponse = await Course.findByIdAndUpdate(courseID,
                                        {$push:{studentEnrolled:userID}},
                                        {new:true});
        
        if(!courseResponse){
            throw new ApiError(400, "course not found");
        }

    } catch (error) {
        throw new ApiError(500, error.message, error)
    }
}