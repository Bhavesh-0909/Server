const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        required:true
    },
    courseDesc:{
        type:String,
        required:true
    },
    insturctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    courseContent:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Section",
        required:true
    }],
    thumbnail:{
        type:String,
        required:true
    },
    whatWillYouLearn:{
        type:String,
        required:true
    },
    ratingAndReview:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    studentEnrolled:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]

},{timestamps:true});

module.exports = mongoose.model("Course", courseSchema);