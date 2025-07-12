const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res,next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!decoded?.userId) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        const user = await UserSchema.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {
    authMiddleware
}