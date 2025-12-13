import express from 'express';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.routes.js";
import messageRoute from "./routes/message.route.js"
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from './lib/db.js';
import cookieParser from "cookie-parser";
import cors from "cors"
import { app,server } from './lib/socket.js';

dotenv.config();
// https://chat-application-one-chi.vercel.app/login
// const app = express();    we use this in socket.js
const ALLOWED_ORIGINS = [
  "https://chat-application-frontend-ot4j.onrender.com",
//   "https://chat-application-one-chi.vercel.app",
  "http://localhost:5173"
];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, mobile apps, or same-origin)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed by policy"), false);
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
// Increase payload size to allow base64 image uploads from the frontend
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser())


// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// Increase payload size to allow base64 image uploads from the frontend
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages",messageRoute)

// Serve frontend in production
// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "../frontend/dist")));

//     // Express v5 wildcard route fix
//    app.get(/(.*)/, (req, res) => {
//         res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
//     });
// }

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
