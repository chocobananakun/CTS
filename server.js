const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http, {
  cors: {
    origin: "*"
  }
});

let messages = [];

app.use(express.json());

// RESTエンドポイント
app.get("/messages", (req, res) => {
  res.json(messages);
});

app.post("/send", (req, res) => {
  const msg = { user: req.body.user, text: req.body.text, time: Date.now() };
  messages.push(msg);
  io.emit("message", msg);
  res.sendStatus(200);
});

// WebSocket通信
io.on("connection", socket => {
  console.log("A user connected");
  socket.emit("init", messages);
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// RenderでPORTが環境変数になる
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
