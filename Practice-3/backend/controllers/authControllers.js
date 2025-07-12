const UserSchema = require('../models/UserSchema');
const cloudinary = require('cloudinary').v2;
const { generateAndSetToken } = require('../generateToken/generateToken')
const bcryptjs = require('bcryptjs')

const registerUser = async (req, res) => {
    try {
        const { name, password, email, profileImage } = req.body;
        if (!name || !password || !email || !profileImage) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password should be at least 8 characters"
            });
        }

        const userExsist = await UserSchema.findOne({ email });

        if (userExsist) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const uploadImage = await cloudinary.uploader.upload(profileImage, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        })

        const genSalt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, genSalt);


        const user = new UserSchema({
            name,
            email,
            password: hashPassword,
            profileImage: {
                public_id: uploadImage.public_id,
                secure_url: uploadImage.secure_url
            }
        })

        await generateAndSetToken(res,user._id);

        await user.save();


        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });



    } catch (error) {
        console.log("Error in regsiter User Controller", error.message);
        res.status(400).json({
            success: false,
            message: error.message
        })

    }
}



/*------------------------------------
  Login Controller
-------------------------------------*/
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter email and password"
            })
        }


        const user = await UserSchema.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentails."
            })
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentails."
            })
        }

        await generateAndSetToken(res,user._id);


        res.status(200).json({
            success: true,
            message: "Login Successfull",
        })
    } catch (error) {
        console.log("Error in login Controller", error.message);
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}




/*------------------------------------
  Logout Controller
-------------------------------------*/
const logoutUser = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        });
        res.status(200).json({
            success: true,
            message: "Logout Successfull"
        })
    } catch (error) {
        console.log("Error in logout Controller", error.message);
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser
}