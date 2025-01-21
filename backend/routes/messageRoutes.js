const express = require("express");
const { check, validationResult } = require("express-validator");
const {
  sendMessage,
  getMessages,
  updateMessageStatus,
  addReaction,
  editMessage,
  deleteMessage,
  uploadMedia
} = require("../controllers/messageController");

const router = express.Router();

// Message CRUD operations
router.post("/send", [
  check("sender").isMongoId().withMessage("Invalid sender ID"),
  check("recipient").isMongoId().withMessage("Invalid recipient ID"),
  check("text").notEmpty().withMessage("Message text cannot be empty")
], sendMessage);
router.get("/get", getMessages);

// Media upload
router.post("/upload", uploadMedia);

// Message status updates
router.put("/status", [
  check("messageId").isMongoId().withMessage("Invalid message ID"),
  check("status").notEmpty().withMessage("Status cannot be empty")
], updateMessageStatus);

// Message reactions
router.post("/reaction", [
  check("messageId").isMongoId().withMessage("Invalid message ID"),
  check("reactionType").notEmpty().withMessage("Reaction type cannot be empty"),
  check("userId").isMongoId().withMessage("Invalid user ID")
], addReaction);

// Message editing
router.put("/edit", [
  check("messageId").isMongoId().withMessage("Invalid message ID"),
  check("newText").notEmpty().withMessage("New text cannot be empty")
], editMessage);

// Message deletion (soft delete)
router.delete("/delete", [
  check("messageId").isMongoId().withMessage("Invalid message ID")
], deleteMessage);

module.exports = router;
