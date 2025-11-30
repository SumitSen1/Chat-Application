import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Validate input
    if (!fullName ) {
      return res.status(400).json({ message: "fullName is required" });
    }
    if(!email ){
      return res.status(400).json({ message: "Email is required" });
    }
    if(!password){
      return res.status(400).json({ message: "Password is required" });
    }
    // console.log("incomming body",req.body);
    

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({
        message: "User already exists with this email"
      });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    generateToken(savedUser._id, res);

    // Response
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
      }
    });

  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};
export const login = async (req, res) => {
  const {email,password}= req.body;
  
  try {
    // Validate input
    if(!email ){
      return res.status(400).json({ message: "Email is required" });
    }
    if(!password){
      return res.status(400).json({ message: "Password is required" });
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if(!user){
      return res.status(400).json({ message: "Invalid email or password || user is not found" });
    }
    // Compare password
    const isPassMatch = await bcrypt.compare(password,user.password);

    if(!isPassMatch){
      return res.status(400).json({ message: "Invalid email or password || user is not found" });
    }
    generateToken(user._id,res);
    console.log(generateToken(user._id,res));
    
    // Response
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      }
    });

}catch(error){
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal Server error" });//500 means server side error
}
};
export const logout = async (req,res)=>{
  res.cookie("jwt","",{maxAge:0,httpOnly:true});

  return res.status(200).json({message:"Logout Successful"});
}
export const updateProfilePic = async (req,res)=>{
  try {const userId = req.user._id;
  const {profilePic } = req.body;
  if(!profilePic){ return res.status(400).json({message:"Profile picture is required"});}

  const uploadResponse = await cloudinary.uploader.upload(profilePic)
  const updateUser = await User.findByIdAndUpdate(
    userId,
    {profilePic:uploadResponse.secure_url},
    {new:true}
  )
  return res.status(200).json({message:"Profile picture updated successfully",user:updateUser});
}
  catch(error){
    console.log("Error while updateProfilePic :",error);
    res.status(500).json({message:"Internal server error"});
  }
}