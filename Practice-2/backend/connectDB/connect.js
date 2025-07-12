const mongoose = require('mongoose');

const connectDB = (URI)=>{
    mongoose.connect(URI).then(()=>{
        console.log('Database Successfully connected');
    }).catch((err)=>{
        console.error("Something went wrong to connected the database");
    })
}


module.exports = connectDB;