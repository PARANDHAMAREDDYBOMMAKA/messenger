const { Server } = require("socket.io");
const Message = require("./models/Message");
const User = require("./models/User");

const initializeSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      socket.userId = userId; // Store userId on socket object
      // console.log(`${userId} joined the room.`);
    });

    // Typing indicators
    socket.on("typingStart", (data) => {
      const { recipient } = data;
      io.to(recipient).emit("typingStart", { sender: socket.userId });
    });

    socket.on("typingStop", (data) => {
      const { recipient } = data;
      io.to(recipient).emit("typingStop", { sender: socket.userId });
    });

    // Handle message status updates
    socket.on("updateMessageStatus", async (data) => {
      const { messageId, status, recipient } = data;
      try {
        io.to(recipient).emit("messageStatusUpdated", {
          messageId,
          status
        });
      } catch (error) {
        console.error("Error updating message status:", error.message);
      }
    });

    // Handle message reactions
    socket.on("addReaction", async (data) => {
      const { messageId, reactionType, recipient } = data;
      try {
        io.to(recipient).emit("reactionAdded", {
          messageId,
          reaction: {
            type: reactionType,
            userId: socket.userId,
            timestamp: new Date()
          }
        });
      } catch (error) {
        console.error("Error adding reaction:", error.message);
      }
    });

    // Handle message edits
    socket.on("editMessage", async (data) => {
      const { messageId, newText, recipient } = data;
      try {
        io.to(recipient).emit("messageEdited", {
          messageId,
          newText,
          edited: true
        });
      } catch (error) {
        console.error("Error editing message:", error.message);
      }
    });

    // Handle message deletions
    socket.on("deleteMessage", async (data) => {
      const { messageId, recipient } = data;
      try {
        io.to(recipient).emit("messageDeleted", {
          messageId
        });
      } catch (error) {
        console.error("Error deleting message:", error.message);
      }
    });

    // Handle media message upload
    socket.on("uploadMedia", async (data) => {
      const { sender, recipient, media } = data;
      
      try {
        const senderUser = await User.findOne({ username: sender });
        const recipientUser = await User.findOne({ _id: recipient });

        if (!senderUser || !recipientUser) {
          throw new Error("Invalid sender or recipient");
        }

        const newMessage = new Message({
          sender: senderUser._id,
          recipient: recipientUser._id,
          media
        });

        await newMessage.save();

        io.to(recipientUser._id.toString()).emit("receiveMessage", {
          ...newMessage.toObject(),
          sender: senderUser.email,
        });
      } catch (error) {
        console.error("Error saving media message:", error.message);
      }
    });

    // Handle forwarded messages
    socket.on("forwardMessage", async (data) => {
      const { messageId, recipients } = data;
      
      try {
        const originalMessage = await Message.findById(messageId);
        if (!originalMessage) {
          throw new Error("Original message not found");
        }

        const forwardedMessages = await Promise.all(recipients.map(async recipient => {
          const newMessage = new Message({
            sender: originalMessage.sender,
            recipient,
            text: originalMessage.text,
            media: originalMessage.media,
            forwarded: true
          });
          await newMessage.save();
          
          // Notify recipient
          io.to(recipient.toString()).emit("receiveMessage", {
            ...newMessage.toObject(),
            sender: originalMessage.sender.email
          });
          
          return newMessage;
        }));

        // Notify sender that message was forwarded
        io.to(socket.userId).emit("messageForwarded", {
          originalMessageId: messageId,
          forwardedMessages
        });
      } catch (error) {
        console.error("Error forwarding message:", error.message);
      }
    });

    // Handle message replies
    socket.on("sendReply", async (data) => {
      const { sender, recipient, text, replyTo } = data;
      
      try {
        const senderUser = await User.findOne({ username: sender });
        const recipientUser = await User.findOne({ _id: recipient });
        const parentMessage = await Message.findById(replyTo);

        if (!senderUser || !recipientUser || !parentMessage) {
          throw new Error("Invalid sender, recipient or parent message");
        }

        const newMessage = new Message({
          text,
          sender: senderUser._id,
          recipient: recipientUser._id,
          replyTo: parentMessage._id
        });

        await newMessage.save();

        io.to(recipientUser._id.toString()).emit("receiveMessage", {
          ...newMessage.toObject(),
          sender: senderUser.email,
          parentMessage: parentMessage.toObject()
        });
      } catch (error) {
        console.error("Error sending reply:", error.message);
      }
    });

    socket.on("sendMessage", async (data) => {
      const { sender, recipient, text, media, replyTo } = data;

      try {
        const senderUser = await User.findOne({ username: sender });
        const recipientUser = await User.findOne({ _id: recipient });

        if (!senderUser || !recipientUser) {
          throw new Error("Invalid sender or recipient");
        }

        const newMessage = new Message({
          text,
          sender: senderUser._id,
          recipient: recipientUser._id,
          media,
          replyTo
        });

        await newMessage.save();

        io.to(recipientUser._id.toString()).emit("receiveMessage", {
          ...newMessage.toObject(),
          sender: senderUser.email,
          parentMessage: replyTo ? await Message.findById(replyTo) : null
        });
      } catch (error) {
        console.error("Error saving message:", error.message);
      }
    });
  });
};

module.exports = initializeSocket;
