const queue = require("../config/bullMq");

const postMessage = async (req, res) => {
  const { conversationId, text, sender } = req.body;
  try {
    const task = await queue.add("newMessage", {
      conversationId,
      text,
      sender,
    });
    res
      .status(202)
      .json({ message: "Message is being processed", taskId: task.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { postMessage };
