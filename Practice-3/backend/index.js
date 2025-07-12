const express = require('express');
const app = express();
require('dotenv').config()
const connectDB = require('./connectDB/connect')
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');


app.get('/test', (req, res) => {
    res.send('These route is using for testing route')
})
app.use('api/v1/user',authRoutes)
app.use('api/v1/blog',blogRoutes)


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log(" Error connecting to database", error.message)
    }
}


start();