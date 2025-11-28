import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/User.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error occur while getAllUsers in controller ");
    res.status(500).json({ message: "Server error" });
  }
};
export const getMessageByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const message = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({createdAt:1})
    res.status(200).json(message);
  } catch (error) {
    console.log("Error while getting getMessageByUserId in message controller: ",error);
    res.status(500).json({ message: "error in getMessageByUserId", error });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or Message is required" });
    }
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error occur in sendMessage :", error);
    res.status(500).json({ message: "Error in sendMessage :", error });
  }
};
export const getChatPartners = async (req,res)=>{
  try {
    const loggedInUserId = req.user._id;

    const message = await Message.find({
      $or:[{senderId:loggedInUserId},{receiverId:loggedInUserId}]
    })

    const chatPartnerIds = [
      ...new Set(
        message.map((msg)=>
        msg.senderId.toString()=== loggedInUserId.toString()
        ? msg.receiverId.toString()
        : msg.senderId.toString()  

      )
    )
  ] 
  const chatPartners = await User.find({_id:{$in:chatPartnerIds}}).select("-password")

  res.status(200).json(chatPartners)
  } catch (error) {
    console.log("Error occur in getChatPartners :",error);
    res.status(500).json({message:"Error occur in getChatPartners :",error})
  }
}