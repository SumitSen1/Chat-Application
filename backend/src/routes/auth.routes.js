import express from "express";
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js"
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";
import multer from 'multer';

const router = express.Router();

// multer for multipart/form-data (memory storage)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// router.use(arcjetProtection);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Accept either multipart/form-data (field 'profilePic') or base64 in body.profilePic
router.put("/update-profile", protectRoute, upload.single('profilePic'), updateProfile);

// Protected route to check auth and return sanitized user
router.get("/check-auth", protectRoute, (req, res) => res.status(200).json({
	_id: req.user._id,
	fullName: req.user.fullName,
	email: req.user.email,
	profilePic: req.user.profilePic
}));

export default router;