const mongoose = require('mongoose');


const connectDB = async(URI)=>{
    mongoose.connect(URI).then(()=>{
        console.log("Database Succesfully Connected");
    }).catch((error)=>{
        console.log("Error connecting to MongoDB", error);
    })
}


module.exports = connectDB