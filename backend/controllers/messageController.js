const Message = require("../models/Message");

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postMessage = async (req, res) => {
  const { text, sender } = req.body;
  try {
    const newMessage = new Message({ text, sender, timestamp: new Date() });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMessages, postMessage };
