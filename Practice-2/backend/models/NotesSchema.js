const mongoose = require('mongoose');


const NotesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        enum: [
            // Productivity & Work
            "Work",
            "Meeting",
            "Tasks",
            "Project",
            "Deadline",
            "To-Do",
            "Follow-up",

            // Education & Study
            "Lecture",
            "Homework",
            "Exam",
            "Research",
            "Study Notes",
            "Assignment",

            // Personal Development
            "Ideas",
            "Goals",
            "Journal",
            "Books",
            "Quotes",
            "Reflection",

            // Home & Life
            "Groceries",
            "Shopping",
            "Recipes",
            "Budget",
            "Health",
            "Fitness",
            "Travel",

            // Creative & Hobbies
            "Writing",
            "Drawing",
            "Photography",
            "Music",
            "Design",
            "Inspiration",

            // Tech & Development
            "Code",
            "Bug",
            "Feature",
            "Snippet",
            "DevOps",
            "API",

            // Personal & Confidential
            "Passwords",
            "Finance",
            "Important",
            "Private"
        ]
    },
    completed: {
        isCompleted: {
            type: Boolean,
            default: false
        },
        completedAt: {
            type: Date,
            default: null
        }
    }

}, { timestamps: true });


module.exports = mongoose.model('Note', NotesSchema);