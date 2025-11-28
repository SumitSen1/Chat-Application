import express, { json } from 'express';
import { signup,login,logout ,updateProfilePic} from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';
import { arcjetProtection } from '../middlewares/arcjet.middleware.js';

const router = express.Router()
// router.use(arcjetProtection)
// arcjet protection doesn't fix yet

router.get("/test",arcjetProtection,(req,res)=>{res.status(200).json({message:"Test Route"})})
    
router.post("/signup",signup)
router.post("/login",login)

router.post("/logout",logout)

router.put("/update-profile",protectRoute,updateProfilePic)
router.get("/check-auth",(req,res)=> res.status(200).json(req.user));

export default router