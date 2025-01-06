const Message = require("../models/Message");
const User = require("../models/User");
const mongoose = require("mongoose");

// Send message function
const sendMessage = async (req, res) => {
  const { sender, recipient, text, media, replyTo, forwarded } = req.body;

  // Validate ObjectIds
  if (
    !mongoose.Types.ObjectId.isValid(sender) ||
    !mongoose.Types.ObjectId.isValid(recipient)
  ) {
    return res.status(400).json({ message: "Invalid sender or recipient ID" });
  }

  // Validate replyTo if present
  if (replyTo && !mongoose.Types.ObjectId.isValid(replyTo)) {
    return res.status(400).json({ message: "Invalid replyTo message ID" });
  }

  try {
    const messageData = {
      sender,
      recipient,
      text,
      media,
      replyTo,
      forwarded: forwarded || false,
      searchText: text // For search indexing
    };

    const newMessage = new Message(messageData);
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
    })
    .sort({ timestamp: 1 })
    .populate('sender', 'username email')
    .populate('recipient', 'username email');

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
};

// Update message status
const updateMessageStatus = async (req, res) => {
  const { messageId, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ message: "Invalid message ID" });
  }

  try {
    const message = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Status updated", updatedMessage: message });
  } catch (error) {
    console.error("Error updating message status:", error.message);
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};

// Add reaction to message
const addReaction = async (req, res) => {
  const { messageId, reactionType, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(messageId) || 
      !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid message or user ID" });
  }

  try {
    const message = await Message.findByIdAndUpdate(
      messageId,
      { $push: { reactions: { type: reactionType, userId } } },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Reaction added", updatedMessage: message });
  } catch (error) {
    console.error("Error adding reaction:", error.message);
    res.status(500).json({ message: "Error adding reaction", error: error.message });
  }
};

// Edit message text
const editMessage = async (req, res) => {
  const { messageId, newText } = req.body;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ message: "Invalid message ID" });
  }

  try {
    const message = await Message.findByIdAndUpdate(
      messageId,
      { text: newText, edited: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message edited", updatedMessage: message });
  } catch (error) {
    console.error("Error editing message:", error.message);
    res.status(500).json({ message: "Error editing message", error: error.message });
  }
};

// Delete message (soft delete)
const deleteMessage = async (req, res) => {
  const { messageId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ message: "Invalid message ID" });
  }

  try {
    const message = await Message.findByIdAndUpdate(
      messageId,
      { deleted: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted", updatedMessage: message });
  } catch (error) {
    console.error("Error deleting message:", error.message);
    res.status(500).json({ message: "Error deleting message", error: error.message });
  }
};

// Upload media files
const uploadMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const mediaFiles = req.files.map(file => ({
      type: file.mimetype.startsWith('image') ? 'image' : 
            file.mimetype.startsWith('video') ? 'video' : 'document',
      url: file.path,
      size: file.size,
      fileName: file.originalname
    }));

    res.status(200).json({ mediaFiles });
  } catch (error) {
    console.error("Error uploading media:", error.message);
    res.status(500).json({ message: "Error uploading media", error: error.message });
  }
};

// Forward message
const forwardMessage = async (req, res) => {
  const { messageId, recipients } = req.body;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ message: "Invalid message ID" });
  }

  try {
    const originalMessage = await Message.findById(messageId);
    if (!originalMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    const forwardedMessages = await Promise.all(recipients.map(async recipient => {
      const newMessage = new Message({
        sender: originalMessage.sender,
        recipient,
        text: originalMessage.text,
        media: originalMessage.media,
        forwarded: true
      });
      return await newMessage.save();
    }));

    res.status(200).json({ forwardedMessages });
  } catch (error) {
    console.error("Error forwarding message:", error.message);
    res.status(500).json({ message: "Error forwarding message", error: error.message });
  }
};

// Search messages
const searchMessages = async (req, res) => {
  const { query, userId } = req.query;

  if (!query || query.length < 3) {
    return res.status(400).json({ message: "Search query must be at least 3 characters" });
  }

  try {
    const messages = await Message.find({
      $text: { $search: query },
      $or: [
        { sender: userId },
        { recipient: userId }
      ]
    }).sort({ timestamp: -1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error searching messages:", error.message);
    res.status(500).json({ message: "Error searching messages", error: error.message });
  }
};

module.exports = { 
  sendMessage, 
  getMessages,
  updateMessageStatus,
  addReaction,
  editMessage,
  deleteMessage,
  uploadMedia,
  forwardMessage,
  searchMessages
};
