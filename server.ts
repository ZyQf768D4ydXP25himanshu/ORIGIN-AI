import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import multer from "multer";
import FormData from "form-data";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  const PORT = 3000;

  // Real-time System Data Simulation
  setInterval(() => {
    const systemStats = {
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      activeUsers: Math.floor(Math.random() * 50) + 1,
      tasksProcessed: Math.floor(Math.random() * 10000)
    };
    io.emit("system_stats", systemStats);
  }, 2000);

  io.on("connection", (socket) => {
    console.log("Client connected to real-time stream:", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // MongoDB Connection
  const MONGODB_URI = process.env.MONGODB_URI;
  if (MONGODB_URI) {
    mongoose
      .connect(MONGODB_URI)
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("MongoDB connection error:", err));
  } else {
    console.warn("MONGODB_URI not found in environment variables. Database features will be disabled.");
  }

  // Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for development with Vite
  }));
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  // AI Proxy Routes
  app.post("/api/ai/proxy", async (req: any, res: any) => {
    const { provider, messages, model } = req.body;
    
    let apiUrl = "";
    let apiKey = "";
    let body: any = {};
    let headers: any = {
      "Content-Type": "application/json"
    };

    switch (provider) {
      case "openai":
        apiUrl = "https://api.openai.com/v1/chat/completions";
        apiKey = process.env.OPENAI_API_KEY || "";
        body = { model: model || "gpt-4o", messages };
        headers["Authorization"] = `Bearer ${apiKey}`;
        break;
      case "deepseek":
        apiUrl = "https://api.deepseek.com/v1/chat/completions";
        apiKey = process.env.DEEPSEEK_API_KEY || "";
        body = { model: model || "deepseek-chat", messages };
        headers["Authorization"] = `Bearer ${apiKey}`;
        break;
      case "groq":
        apiUrl = "https://api.groq.com/openai/v1/chat/completions";
        apiKey = process.env.GROQ_API_KEY || "";
        body = { model: model || "llama3-8b-8192", messages };
        headers["Authorization"] = `Bearer ${apiKey}`;
        break;
      case "novita":
        apiUrl = "https://api.novita.ai/v3/openai/chat/completions";
        apiKey = process.env.NOVITA_AI_API_KEY || "";
        body = { model: model || "meta-llama/llama-3-70b-instruct", messages };
        headers["Authorization"] = `Bearer ${apiKey}`;
        break;
      case "huggingface":
        apiUrl = `https://api-inference.huggingface.co/models/${model || "meta-llama/Llama-3.2-3B-Instruct"}`;
        apiKey = process.env.HUGGINGFACE_API_KEY || "";
        body = { inputs: messages[messages.length - 1].content };
        headers["Authorization"] = `Bearer ${apiKey}`;
        break;
      default:
        return res.status(400).json({ error: "Invalid provider" });
    }

    if (!apiKey) {
      return res.status(401).json({ error: `${provider} API key not configured` });
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json(errorData);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error(`${provider} Proxy Error:`, error);
      res.status(500).json({ error: `Failed to process ${provider} request` });
    }
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      version: "1.0.0",
      founder: "Himanshu Shukla",
      company: "ORIGIN-AI"
    });
  });

  // Example API for OS data
  app.get("/api/system/info", (req, res) => {
    res.json({
      osName: "ORIGIN-AI OS",
      kernel: "v1.0.0-stable",
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      copyright: "© Himanshu Shukla, Founder and CEO"
    });
  });

  // Python Execution API
  app.post("/api/python/execute", (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "No code provided" });

    const { spawn } = require("child_process");
    const python = spawn("python3", ["-c", code]);

    let stdout = "";
    let stderr = "";

    python.stdout.on("data", (data: any) => {
      stdout += data.toString();
    });

    python.stderr.on("data", (data: any) => {
      stderr += data.toString();
    });

    python.on("close", (code: number) => {
      res.json({ stdout, stderr, exitCode: code });
    });
  });

  // ElevenLabs TTS Proxy
  app.post("/api/tts/elevenlabs", async (req: any, res: any) => {
    const { text, voiceId: requestedVoiceId } = req.body;
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = requestedVoiceId || process.env.ELEVENLABS_VOICE_ID || "pNInz6obpg8j9YshmsPq";

    if (!apiKey) {
      return res.status(401).json({ error: "ElevenLabs API key not configured" });
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json(errorData);
      }

      const audioBuffer = await response.arrayBuffer();
      res.set("Content-Type", "audio/mpeg");
      res.send(Buffer.from(audioBuffer));
    } catch (error) {
      console.error("ElevenLabs Proxy Error:", error);
      res.status(500).json({ error: "Failed to process TTS request" });
    }
  });

  // ElevenLabs STT Proxy (Scribe)
  app.post("/api/stt/elevenlabs", upload.single("file"), async (req: any, res: any) => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return res.status(401).json({ error: "ElevenLabs API key not configured" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    try {
      const form = new FormData();
      form.append("file", req.file.buffer, {
        filename: req.file.originalname || "audio.webm",
        contentType: req.file.mimetype,
      });
      form.append("model_id", "scribe_v1");

      const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          ...form.getHeaders(),
        },
        body: form as any,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json(errorData);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("ElevenLabs STT Proxy Error:", error);
      res.status(500).json({ error: "Failed to process STT request" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("Copyright © Himanshu Shukla, Founder and CEO");
  });
}

startServer();
