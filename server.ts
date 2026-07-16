import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import AdmZip from "adm-zip";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to support JSON payloads up to 50MB (needed for full code edits)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API 1: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date() });
  });

  // API 2: Dynamic Project ZIP Downloader
  app.post("/api/download-project", (req, res) => {
    try {
      const files: { path: string; content: string }[] = req.body.files;
      if (!files || !Array.isArray(files)) {
        return res.status(400).json({ error: "Missing or invalid files array payload." });
      }

      const zip = new AdmZip();
      for (const file of files) {
        // Ensure path formatting is safe
        const normalizedPath = file.path.replace(/\\/g, "/");
        zip.addFile(normalizedPath, Buffer.from(file.content, "utf-8"));
      }

      const zipBuffer = zip.toBuffer();
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", 'attachment; filename="java_movie_booking_system.zip"');
      res.setHeader("Content-Length", zipBuffer.length.toString());
      res.send(zipBuffer);
    } catch (err: any) {
      console.error("ZIP Generation Error:", err);
      res.status(500).json({ error: "Failed to generate ZIP archive: " + err.message });
    }
  });

  // API 3: AI Developer Assistant Chat Proxy
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid request. 'messages' array is required." });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API Key is not configured in secrets." });
      }

      // Convert messages to Gemini format: roles must be 'user' or 'model' (assistant maps to model)
      const formattedContents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content || "" }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: `You are an expert Java Enterprise Architect and Senior Web Developer. Your task is to assist the user with understanding, extending, refactoring, or debugging their MVC Java Movie Ticket Booking System. The project is constructed using standard Java Servlets, JSP pages, JDBC connections, and a MySQL database.

Always provide complete, highly accurate, and clean code blocks. Give detailed explanations about:
- Servlet lifecycles and web.xml configurations
- JDBC statements, connection pooling, and safe transaction handling (preventing SQL injection with PreparedStatement)
- JSP directives, scriptlets, expression language, and modern Tailwind grids styling
- MySQL schema setups and index configurations.

Be concise, encouraging, and write in clear, simple language without jargon.`,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini Proxy Error:", err);
      res.status(500).json({ error: err.message || "An error occurred with Gemini AI." });
    }
  });

  // Vite middleware for dev mode vs serving production build assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} under NODE_ENV=${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server startup crash:", err);
});
