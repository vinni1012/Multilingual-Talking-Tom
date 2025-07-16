import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { spawn } from "child_process";
import cors from "cors";
import openaiRouter from "./openai.js";

dotenv.config(); // ✅ Load environment variables

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // frontend port
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// OpenAI route
app.use("/api/openai", openaiRouter);

// Real-time screenshot streaming (if using playwright.js etc.)
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("start-bot", () => {
    const botProcess = spawn("node", ["playwright.js"]);

    botProcess.stdout.on("data", (data) => {
      socket.emit("bot-output", data.toString());
    });

    botProcess.stderr.on("data", (data) => {
      socket.emit("bot-error", data.toString());
    });

    botProcess.on("close", (code) => {
      socket.emit("bot-exit", `Bot exited with code ${code}`);
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Gmail Automation Bot backend is running on http://localhost:${PORT}`);
});
