const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./connectDB/connect')
const cloudinary = require('cloudinary');
const authRoutes = require('./routes/authRoutes')
const todoRoutes = require('./routes/todoRoutes')


app.use(express.json());
app.use(express.urlencoded({extended: true}));


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})



app.get('/test',(req,res)=>{
    res.send("This Is working , these route for testing purpose!!");
})
app.use('api/v1/user',authRoutes);
app.use('api/v1/todo',todoRoutes);


const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("Error in starting server", error.message);
    }
}

start();