const { Server } = require("socket.io");
const Message = require("./models/Message");
const User = require("./models/User");

const initializeSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      // console.log(`${userId} joined the room.`);
    });

    socket.on("sendMessage", async (data) => {
      const { sender, recipient, text } = data;
      // console.log(sender, recipient, text);

      try {
        const senderUser = await User.findOne({ username: sender });
        const recipientUser = await User.findOne({ _id: recipient });

        // console.log(senderUser);
        // console.log(recipientUser);

        if (!senderUser || !recipientUser) {
          throw new Error("Invalid sender or recipient email.");
        }

        const newMessage = new Message({
          text,
          sender: senderUser._id,
          recipient: recipientUser._id,
        });

        // console.log("New message:", newMessage);

        await newMessage.save();

        io.to(recipientUser._id.toString()).emit("receiveMessage", {
          ...newMessage.toObject(),
          sender: senderUser.email,
        });
      } catch (error) {
        console.error("Error saving message:", error.message);
      }
    });
  });
};

module.exports = initializeSocket;
