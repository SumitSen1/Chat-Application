import express from "express";
import {arcjetProtection} from "../middlewares/arcjet.middleware.js"
import {protectRoute} from "../middlewares/protectRoute.js"
import { getAllUsers, getChatPartners, getMessageByUserId, sendMessage } from "../controllers/message.controller.js";


const router = express.Router();
router.use(arcjetProtection,protectRoute)

router.get("/contacts",getAllUsers) 
router.get("/chats",getChatPartners)
router.get("/:id",getMessageByUserId)
router.post("/send/:id",sendMessage)


export default router;