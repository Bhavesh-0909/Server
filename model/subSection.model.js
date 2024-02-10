const mongoose = require('mongoose');

const subSectionSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
    },
    videoUrl:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    additionalUrl:{
        type:String,
    }
});

module.exports = mongoose.model("SubSection", subSectionSchema);