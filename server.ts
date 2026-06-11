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

  // Initialize Gemini
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API endpoint for City Copilot Chat
  app.post("/api/copilot", async (req, res) => {
    try {
      const { message, cityContext, history } = req.body;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        return res.status(200).json({
          text: `### ⚠️ SYSTEM ALERT: API Key Unconfigured\n\n**Risk Summary**: Real-time analysis is active, but the Gemini API key has not been supplied yet.\n**Most Affected Zone**: Simulator operations continue internally.\n**Recommended Actions**:\n1. Configure your \`GEMINI_API_KEY\` in the **Settings > Secrets** panel of the AI Studio workspace.\n2. The CityOS AI core operates using simulated fallback logic in the meantime.\n\n**Estimated Impact**: Once the API secret is configured, complete government-grade AI responses will stream online instantly.`
        });
      }

      const systemInstruction = `You are City Copilot. You monitor the entire city of Hyderabad.
Analyze the following parameters in real time:
- Traffic Indices
- Flood Risks
- AQI (Air Quality Index)
- Waste levels
- Active Emergencies

Current City Operating State:
${JSON.stringify(cityContext, null, 2)}

Provide concise, professional, government-grade actionable recommendations.
Always return these four exact sections with heading-style markdown:
1. **Risk Summary**: Quick high-level state of the city's safety and main alerts.
2. **Most Affected Zone**: Identify the zone in highest jeopardy with details why.
3. **Recommended Actions**: List clear steps for dispatch teams and state responses.
4. **Estimated Impact**: Predicted resolution metrics after actions are taken.

Adopt a confident, analytical, official Smart City Command Center tone. Do not use verbose conversational filler. Make it highly executive.`;

      // Structure contents with history for full conversation support
      const listContents: any[] = [];
      
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          listContents.push({
            role: turn.role === "user" ? "user" : "model",
            parts: [{ text: turn.text }]
          });
        }
      }
      
      listContents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: listContents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error in backend:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to 0.0.0.0 and PORT 3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
