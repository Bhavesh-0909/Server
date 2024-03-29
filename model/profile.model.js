const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    gender:{
        type:String,
        enum:["Male", "Female", "Others"]
    },
    bioData:{
        type:String,
    },
    profession:{
        type:String,
    },
    dob:{
        type:Date
    }
});

module.exports = mongoose.model("Profile", profileSchema);