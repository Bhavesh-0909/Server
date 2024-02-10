const mongoose = require('mongoose');
require('dotenv').config()

const mongoseDB = async() => {
    await mongoose.connect(process.env.MONGOOSE_URI)
    .then(()=> console.log("DB connected successfully"))
    .catch((error)=> {
        console.log("DB NOT CONNECTED");
        console.error(error);
    })
}

module.exports = mongoseDB;