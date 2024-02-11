const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            trim:true
        },
        lastName:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            trim:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        contactNo:{
            type:Number,
            required:true,
            trim:true
        },
        accountType:{
            type:String,
            required:true,
            enum:["Admin","Student","Instructor"]
        },
        courses:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Courses"
        }],
        profile:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Profile"
        },
        courseProgress:[{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Courseprogress"
        }]
    },
    {timestamps:true});

module.exports = mongoose.model("User", userSchema);