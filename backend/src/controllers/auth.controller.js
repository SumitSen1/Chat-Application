import User from "../models/auth.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Validate input
    if (!fullName ) {
      return res.status(400).json({ message: "fullname is required" });
    }
    if(!email ){
      return res.status(400).json({ message: "Email is required" });
    }
    if(!password){
      return res.status(400).json({ message: "Password is required" });
    }

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

    // Response
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: savedUser._id,
        fullname: savedUser.fullname,
        email: savedUser.email,
      }
    });

  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};
