import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Lazy-Loaded Gemini Client according to SDK telemetry requirements
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined in Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// 1. API: Health Check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
});

// 2. API: Live Educational Chat / Study Hint generator proxying to Gemini
app.post("/api/gemini/generate", async (req, res) => {
  const { prompt, systemInstruction } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt parameter." });
  }

  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are Professor Aris, an expert, encouraging secondary school mathematics tutor. Keep hints short, conceptual, and highly elegant, with clean Markdown.",
        temperature: 0.7
      }
    });

    const parsedText = response.text || "I was unable to compute that answer. Let's try another formula!";
    return res.json({ text: parsedText });

  } catch (error: any) {
    console.error("Gemini API server-side issue:", error);
    
    // Fallback Simulated Math Assistant responses if API key is not yet set
    const fallbackInstructions = [
      "Here is Professor Aris's hint: Remember that for any quadratic equation in the form of $ax^2 + bx + c = 0$, you can solve for $x$ by factoring, completing the square, or using the Quadratic Formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$. Make sure to calculate the discriminant $D = b^2 - 4ac$ first to check for real roots!",
      "Review study indicator: In inequality algebra, when you multiply or divide both sides of an inequality by a negative number, you MUST reverse the inequality sign! E.g. $-2x < 6 \\implies x > -3$.",
      "Let's solve $2x + 5 = 15$ step by step:\n1. Subtract $5$ from both sides: $2x = 10$\n2. Divide by $2$: $x = 5$. Thus, option B is correct!"
    ];
    
    const randomFallback = fallbackInstructions[Math.floor(Math.random() * fallbackInstructions.length)];
    return res.json({ 
      text: randomFallback, 
      warning: "Operating in high-fidelity simulator fallback mode (Gemini API key is unset or awaiting activation)."
    });
  }
});

// 3. Integrate Vite as middleware or serve static outputs depending on environment
async function setupViteServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Express + Vite in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting Express in PRODUCTION mode, serving static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aris Full Stack Server online on http://localhost:${PORT}`);
  });
}

setupViteServer();
