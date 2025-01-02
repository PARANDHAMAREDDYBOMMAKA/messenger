const express = require("express");
const http = require("http");
const cors = require("cors");
const socketio = require("./socket");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api", messageRoutes);
app.use("/api/users", userRoutes);

socketio(server);

const PORT = 8000;
server.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
