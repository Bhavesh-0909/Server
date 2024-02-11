const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
        }],
        avatar:{
            type:String,
            required:true
        }
    },
    {timestamps:true});

userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, process.env.HASHING_ROUND);

    this.profile ={
        gender:null, dob:null, bioData:null, profession:null
    }
    this.avatar = `https://api.dicebear.com/5.x/initials/svg?seed=${this.firstname} ${this.lastName}&radius=50`;
    next();
});

userSchema.method.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("User", userSchema);