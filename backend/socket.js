const { Server } = require("socket.io");

const initializeSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", (data) => {
      io.emit("receiveMessage", data);
    });

    // socket.on("disconnect", () => {
    //   console.log("User disconnected");
    // });
  });
};

module.exports = initializeSocket;
