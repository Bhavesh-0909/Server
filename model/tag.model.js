const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    title:{
        type:String
    }
});

module.exports = mongoose.model("Tag", tagSchema);