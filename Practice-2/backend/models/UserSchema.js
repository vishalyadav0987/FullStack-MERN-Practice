const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true  
    },
    profileImage:{
        public_id:{
            type:String,
        },
        secure_url:{
            type:String
        }
    },
    todos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Note'
        }
    ]
},{timestamps:true});


module.exports = mongoose.model('user',UserSchema);