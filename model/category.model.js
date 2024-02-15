const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    courses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }]
});

module.exports = mongoose.model("Category", tagSchema);