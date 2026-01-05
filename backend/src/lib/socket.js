import { Server } from "socket.io";
import http from 'http'
import express from 'express'
import { socketAuthMiddleware } from "../middlewares/auth.Socket.Middleware.js";
import dotenv from 'dotenv';

// ensure environment variables are loaded when this module runs
dotenv.config();

const app = express()
const server  = http.createServer(app)
// Build allowed origins from env: prefer CLIENT_ORIGINS (comma-separated),
// fallback to CLIENT_URL for single origin.
const allowed = (process.env.CLIENT_ORIGINS || process.env.CLIENT_URL || "")
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

let corsOptions;
if (process.env.NODE_ENV !== 'production') {
  // permissive in development to allow localhost dev servers
  corsOptions = { origin: true, credentials: true, methods: ['GET', 'POST'] };
} else {
  corsOptions = {
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl, same-origin)
      if (!origin) return callback(null, true);
      if (allowed.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST'],
  };
}

const io = new Server(server, { cors: corsOptions });

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
