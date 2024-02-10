const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating:{
        type:Number,
        max:5,
        min:0
    },
    description:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
});

module.exports = mongoose.model("Review", reviewSchema);