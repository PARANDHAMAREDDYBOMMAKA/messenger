const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  text: { type: String },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
  reactions: [
    {
      type: { type: String, required: true },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  edited: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  media: [
    {
      type: {
        type: String,
        enum: ["image", "video", "document"],
        required: true,
      },
      url: { type: String, required: true },
      thumbnail: String,
      size: Number,
      duration: Number, // For videos
      fileName: String, // For documents
    },
  ],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  forwarded: { type: Boolean, default: false },
  pinned: { type: Boolean, default: false },
  searchText: String, // For full-text search
});

module.exports = mongoose.model("Message", MessageSchema);
