const mongoose = require('mongoose');
const { type } = require('os');

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
            ref:'Todo'
        }
    ]
},{timestamps:true});


module.exports = mongoose.model('user',UserSchema);