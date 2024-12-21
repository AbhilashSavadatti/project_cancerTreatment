const WebSocket = require("ws");

const PORT = 8080; // Dummy port
const server = new WebSocket.Server({ port: PORT });

const peers = new Map(); // Store connected peers with their socket IDs

console.log(`Signaling server running on ws://localhost:${PORT}`);

server.on("connection", (socket) => {
  console.log("New peer connected!");

  socket.on("message", (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "offer":
      case "answer":
      case "candidate":
        // Send the message to the target peer
        const targetSocket = peers.get(data.target);
        if (targetSocket) {
          targetSocket.send(JSON.stringify(data));
        }
        break;

      case "register":
        // Register the peer in the peer map
        peers.set(data.id, socket);
        console.log(`Peer registered with ID: ${data.id}`);
        break;

      default:
        console.log("Unknown message type:", data.type);
    }
  });

  socket.on("close", () => {
    // Remove the disconnected peer
    for (const [id, peerSocket] of peers.entries()) {
      if (peerSocket === socket) {
        peers.delete(id);
        console.log(`Peer disconnected: ${id}`);
        break;
      }
    }
  });
});
