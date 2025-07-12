const jwt = require('jsonwebtoken');

const generateAndSetToken = async (res, userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
            expiresIn: '7d'
        });

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 *
                1000),
            maxAge: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
        })
    } catch (error) {
        console.log("Error in. setting token in cookie", error);
    }
};



module.exports = {
    generateAndSetToken
}