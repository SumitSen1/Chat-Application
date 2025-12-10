import jwt from "jsonwebtoken";
import User from "../models/User.model.js";


export const socketAuthMiddleware = async (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers?.cookie;
    const token = cookieHeader
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      console.log("Socket Connection rejected : No token provided");
      return next(new Error("Unorthorized -no connection provided"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.log("Socket Connection failed Invalid token ");
      return next(new Error("Unorthorized -Invalid token"));
    }
    //find User

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }
    //Attach user info to socket

    socket.user = user;
    socket.userId = user._id.toString();

    console.log(`Socket authenticated for user: ${user.fullName}`);
    next();
  } catch (error) {
    console.log("Error in Socket connection: ", error);
    next(new Error("Unorthorized -AUTHENTICATION FAIL"));
  }
};
