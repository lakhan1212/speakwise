// import { WebSocketServer } from "ws";
// import { server } from "./server.js";

// export function setupWebSocket(server) {
//   const wss = new WebSocketServer({ server });

//   wss.on("connection", (ws) => {
//     console.log("WebSocket client connected");

//     ws.on("message", (data) => {
//       console.log("Received data:", data.length);

       
//     });

//     ws.on("close", () => {
//       console.log("WebSocket client disconnected");
//     });
//   });
// }