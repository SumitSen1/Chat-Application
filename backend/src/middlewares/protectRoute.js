import User from "../models/User.model.js";
import jwt from "jsonwebtoken"

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized User - No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from database
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Invalid User" });
        }

        req.user = user;  
        next();

    } catch (error) {
        console.log("Error in protected route middleware", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
