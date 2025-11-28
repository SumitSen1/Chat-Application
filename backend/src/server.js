import express from 'express';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.routes.js";
import messageRoute from "./routes/message.route.js"
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from './lib/db.js';
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();
app.use(express.json())
app.use(cookieParser());


// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages",messageRoute)

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // Express v5 wildcard route fix
   app.get(/(.*)/, (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
