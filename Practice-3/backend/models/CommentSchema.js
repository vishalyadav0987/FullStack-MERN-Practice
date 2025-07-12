const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    comment: {
        type: String,
        required: true
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('comment', CommentSchema);

