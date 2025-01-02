const express = require("express");
const Conversation = require("../models/Conversation");

const router = express.Router();

router.post("/", async (req, res) => {
  const { participants } = req.body;
  try {
    let conversation = await Conversation.findOne({ participants: { $all: participants } });
    if (!conversation) {
      conversation = await Conversation.create({ participants });
    }
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
