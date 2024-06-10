const express = require("express");
const path = require("path");
const WebSocket = require("ws");

// Initialize Express server
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Initialize WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  // Send message to client
  ws.send(JSON.stringify({ message: "Welcome new client!" }));

  // Broadcast to all connected clients
  ws.on("message", (data) => {
    console.log(`Received message: ${data}`);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const setIntervalID = setInterval(() => {
  const message = JSON.stringify({
    message: "This is a broadcast message sent every minute"
  });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}, 1000);

setTimeout(() => clearInterval(setIntervalID), 10000);
