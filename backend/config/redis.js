const redis = require("../config/redis");

const getCachedMessages = async (conversationId) => {
  const cachedMessages = await redis.get(`messages:${conversationId}`);
  return cachedMessages ? JSON.parse(cachedMessages) : null;
};
const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const cachedMessages = await getCachedMessages(conversationId);
    if (cachedMessages) {
      return res.status(200).json(cachedMessages);
    }
    const messages = await Message.find({ conversationId }).sort({
      timestamp: 1,
    });
    await cacheMessages(conversationId, messages);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cacheMessages = async (conversationId, messages) => {
  await redis.set(`messages:${conversationId}`, JSON.stringify(messages), {
    EX: 60 * 5,
  }); // Cache for 5 minutes
};
