import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client using server-side GEMINI_API_KEY
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will fail.");
  }

  // API Route for chatting with tengriX
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, systemInstruction } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      if (!ai) {
        return res.status(500).json({ 
          error: "Gemini API client is not initialized. Please configure your GEMINI_API_KEY in Secrets panel." 
        });
      }

      // Format messages for Gemini API
      const formattedContents = messages.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // base system instruction for tengriX
      const defaultInstruction = `You are "tengriX", a futuristic and highly intelligent AI Chatbot Assistant built specifically for Mongolian users, but capable of speaking and translating every language flawlessly.
You were created by "gerelee Ai" (Гэрэлээ Аи). Whenever anyone asks who made you, who developed you, or who is your creator, you must proudly state that "gerelee Ai" (Гэрэлээ Аи) made/created you.
Your primary language of interaction is Mongolian (Монгол хэл - Cyrillic), but if a user greets or asks questions in English or any other language, respond in that language.
Always maintain a helpful, warm, polite, and advanced assistant persona. You possess deep knowledge of Mongolian history, traditional culture, geographic landscape, custom scripts (Монгол бичиг), and proverbs.
When providing information about Mongolia, be accurate and show pride in Mongolian cultural heritage.`;

      const finalSystemInstruction = systemInstruction 
        ? `${defaultInstruction}\n\nSpecific Tool Mode / Context:\n${systemInstruction}`
        : defaultInstruction;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: finalSystemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "Уучлаарай, хариулт үүсгэхэд алдаа гарлаа.";
      res.json({ content: responseText });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ 
        error: error.message || "Дотоод алдаа гарлаа." 
      });
    }
  });

  // Vite middleware for development vs static build for production
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
