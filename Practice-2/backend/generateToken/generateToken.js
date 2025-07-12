const jwt = require('jsonwebtoken')


const generateAndSetToken = async (userId, res) => {
    try {
        const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 *
                1000),
            maxAge: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
        })

    } catch (error) {
        console.log("Error in settiong token in cookie");

    }
}

module.exports = {
    generateAndSetToken
}