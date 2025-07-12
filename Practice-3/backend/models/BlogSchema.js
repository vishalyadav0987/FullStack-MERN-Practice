const mongoose = require('mongoose');


const BlogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required:true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        public_url: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },

    relatedTo: {
        type: String,
        required: true
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],

    

}, {
    timestamps: true
});



module.exports = mongoose.model('blog', BlogSchema)