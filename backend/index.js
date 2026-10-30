import express from "express";
import cors from "cors";
import userRouter from "./router/user.js";
import msgRouter from "./router/msg.js"
import conRouter from "./router/conversation.js"
import llmRouter from "./router/model.js"
// import { setupWebSocket } from "./websocket.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use("/users", userRouter);
app.use("/msg", msgRouter);
app.use("/con", conRouter);
app.use("/llm", llmRouter);

const port = 9999;


const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// setupWebSocket(server);

server.on("error", (error) => {
    console.error(`Unable to start server on port ${port}: ${error.message}`);
    process.exitCode = 1;
});

export { app, server };