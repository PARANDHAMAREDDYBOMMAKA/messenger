const Message = require("../models/Message");
const User = require("../models/User");
const mongoose = require("mongoose");

// Send message function
const sendMessage = async (req, res) => {
  const { sender, recipient, text } = req.body;

  // Validate ObjectIds
  if (
    !mongoose.Types.ObjectId.isValid(sender) ||
    !mongoose.Types.ObjectId.isValid(recipient)
  ) {
    return res.status(400).json({ message: "Invalid sender or recipient ID" });
  }

  try {
    const newMessage = new Message({ sender, recipient, text });
    await newMessage.save();
    res.status(200).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
};

// Get messages function
const getMessages = async (req, res) => {
  const { userId, otherUserId } = req.query;

  // Validate ObjectId for otherUserId
  if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
    return res.status(400).json({ message: "Invalid otherUserId" });
  }

  try {
    const user = await User.findOne({ username: userId });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User  not found with that username" });
    }

    const userObjectId = user._id;

    const messages = await Message.find({
      $or: [
        { sender: userObjectId, recipient: otherUserId },
        { sender: otherUserId, recipient: userObjectId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
};

module.exports = { sendMessage, getMessages };
