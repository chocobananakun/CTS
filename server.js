const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http, {
  cors: {
    origin: "*", // ここを明示する
    methods: ["GET", "POST"],
    credentials: false
  }
});

let messages = [];

app.use(express.json());

app.get("/messages", (req, res) => {
  res.json(messages);
});

app.post("/send", (req, res) => {
  const msg = { user: req.body.user, text: req.body.text, time: Date.now() };
  messages.push(msg);
  io.emit("message", msg);
  res.sendStatus(200);
});

io.on("connection", socket => {
  socket.emit("init", messages);
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
