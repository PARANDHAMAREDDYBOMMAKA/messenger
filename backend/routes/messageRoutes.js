const express = require("express");
const {
  sendMessage,
  getMessages,
  updateMessageStatus,
  addReaction,
  editMessage,
  deleteMessage
} = require("../controllers/messageController");

const router = express.Router();

// Message CRUD operations
router.post("/send", sendMessage);
router.get("/get", getMessages);

// Message status updates
router.put("/status", updateMessageStatus);

// Message reactions
router.post("/reaction", addReaction);

// Message editing
router.put("/edit", editMessage);

// Message deletion (soft delete)
router.delete("/delete", deleteMessage);

module.exports = router;
