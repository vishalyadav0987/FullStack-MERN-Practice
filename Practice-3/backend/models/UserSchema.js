const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    profileImage: {
        public_url: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },

    Blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ],
    savedBlog: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]

}, { timestamps: true });



module.exports = mongoose.model('user', UserSchema);