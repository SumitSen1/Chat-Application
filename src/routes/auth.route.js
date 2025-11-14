import express from "express"

const router = express.Router();

router.get("/signUp",(req,res)=>{
    res.send("SignUp page")
})
router.get("/login",(req,res)=>{
    res.send("Login page")
})
router.get("/logOut",(req,res)=>{
    res.send("LogOut page")
})

export default router;