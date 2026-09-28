const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

// Message schema
const messageSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = 0;

// Test route
app.get("/", (req, res) => {
  res.send("Real-Time Chat Backend is Running");
});

// REST API - Get chat history
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: 1 })
      .limit(100);

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch messages",
    });
  }
});

// REST API - Send/save message
app.post("/api/messages", async (req, res) => {
  try {
    const { username, message, time } = req.body;

    if (!username || !message || !time) {
      return res.status(400).json({
        error: "Username, message and time are required",
      });
    }

    const newMessage = await Message.create({
      username,
      message,
      time,
    });

    // Broadcast to connected users
    io.emit("receive_message", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({
      error: "Failed to save message",
    });
  }
});

// Socket.io connection
io.on("connection", (socket) => {
  onlineUsers++;

  console.log("User connected:", socket.id);
  console.log("Online users:", onlineUsers);

  io.emit("online_users", onlineUsers);

  // User joins
  socket.on("user_join", (username) => {
    const name = username?.trim() || "Anonymous";

    console.log(`${name} joined the chat`);

    socket.username = name;

    socket.broadcast.emit("system_message", {
      type: "join",
      username: name,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  });

  // Receive message through Socket.io
  socket.on("send_message", async (data) => {
    try {
      console.log("Message received:", data);

      const savedMessage = await Message.create({
        username: data.username,
        message: data.message,
        time: data.time,
      });

      io.emit("receive_message", savedMessage);
    } catch (error) {
      console.error("Failed to save message:", error.message);
    }
  });

  // User disconnects
  socket.on("disconnect", () => {
    onlineUsers--;

    console.log("User disconnected:", socket.id);
    console.log("Online users:", onlineUsers);

    io.emit("online_users", onlineUsers);

    if (socket.username) {
      socket.broadcast.emit("system_message", {
        type: "leave",
        username: socket.username,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }
  });
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});