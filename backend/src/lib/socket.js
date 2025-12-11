import { Server } from "socket.io";
import http from 'http'
import express from 'express'
import { socketAuthMiddleware } from "../middlewares/auth.Socket.Middleware.js";

const app = express()
const server  = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST'],
    }
})

//appply authentication middleware to all socket connection
io.use(socketAuthMiddleware);

//this is for storing online user
const userSocketMap = {}

export function getRecieverSocketId(userId){
    return userSocketMap[userId]
}

io.on("connection",(socket)=>{
        const userId = socket.user._id.toString();
        const prevSocketId = userSocketMap[userId];

        // store/update mapping
        userSocketMap[userId] = socket.id;

        // Log only when this is a new connection or socket id changed
        if (!prevSocketId) {
            console.log(`User connected: ${socket.user.fullName} (${userId})`);
        } else if (prevSocketId !== socket.id) {
            console.log(`User reconnected: ${socket.user.fullName} (${userId}), new socket ${socket.id}`);
        }

        // Broadcast current online user ids
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("sendMessage", ({ receiverId, message }) => {
    const receiverSocketId = getRecieverSocketId(receiverId);
    
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", {
            senderId: userId,
            message: message,
        });
    }
    });

    socket.on("disconnect",()=>{
        // Only remove mapping if it still points to this socket
        if (userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId];
            console.log(`User disconnected: ${socket.user.fullName} (${userId})`);
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        } else {
            // If mapping changed (reconnected elsewhere), just log
            console.log(`Socket disconnected for ${socket.user.fullName} but user still has active socket`);
            }
    })
})
export {io,app,server}
