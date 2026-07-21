/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client to prevent startup crash if API key is missing.
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API Endpoints
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// AI Stylist Endpoint (hides key and acts as proxy)
app.post("/api/stylist", async (req, res) => {
  const { prompt, language, currentCart, wishlistProducts } = req.body;

  try {
    const client = getGeminiClient();

    // Prepare catalog context to make Gemini recommendation highly relevant.
    const systemPrompt = `You are an elite, personal haute-couture fashion stylist for 'VOGUE', a luxury clothing store.
Your goal is to suggest the absolute perfect outfit recommendation based on the user's request.
Always output your response in ${language === "ar" ? "Arabic" : "English"}.

Here is the exact catalog of high-fashion clothing items available in our store:
1. SKU: VG-M-COT-01, Name: Classic Tailored Wool Overcoat (Men), Price: $349 ($279 on sale). Brand: Vogue Maison. Colors: Camel, Midnight Black, Charcoal.
2. SKU: VG-W-BLZ-02, Name: Structured Double-Breasted Blazer (Women), Price: $199 ($159 on sale). Brand: Atelier Vogue. Colors: Off-White, Emerald Green, Classic Navy.
3. SKU: VG-W-DRS-03, Name: Lustrous Satin Slip Midi Dress (Women), Price: $149. Brand: Atelier Vogue. Colors: Champagne Gold, Ruby Red, Midnight Black.
4. SKU: VG-M-SHR-04, Name: Premium Linen Button-Down Shirt (Men), Price: $89 ($69 on sale). Brand: Vogue Maison. Colors: Soft Azure, Pure White, Sand Beige.
5. SKU: VG-S-SHO-05, Name: Minimalist Italian Leather Sneakers (Unisex/Shoes), Price: $240. Brand: Vogue Footwear. Colors: Priscilla White, Chic Obsidian.
6. SKU: VG-A-BAG-06, Name: Sienna Pebbled Leather Tote (Bags), Price: $290 ($249 on sale). Brand: Vogue Leathercraft. Colors: Sienna Tan, Noir Black, Taupe.
7. SKU: VG-K-SWE-07, Name: Organic Cotton Ribbed Knit Sweater (Kids), Price: $55. Brand: Vogue Petit. Colors: Sage Green, Oatmeal Beige.
8. SKU: VG-A-SUN-08, Name: Milano Polarized Acetate Sunglasses (Accessories), Price: $125 ($95 on sale). Brand: Vogue Accents. Colors: Tortoise Shell, Classic Obsidian.
9. SKU: VG-V-WND-09, Name: Vapor-Block Lightweight Windbreaker (Activewear), Price: $135. Brand: Vogue Active. Colors: Alpine Mint, Slate Grey.
10. SKU: VG-W-KN-10, Name: Ultra-Fine Cashmere Knit Sweater (Women), Price: $180 ($144 on sale). Brand: Atelier Vogue. Colors: Heather Oatmeal, Cloud Pink, Sage Green.
11. SKU: VG-M-SU-11, Name: Modern Fit Wool-Silk Suit Blazer (Men), Price: $399. Brand: Vogue Tailors. Colors: Obsidian Black, Royal Midnight Blue.
12. SKU: VG-A-NL-12, Name: 18K Gold-Plated Chunky Chain Link Necklace (Accessories), Price: $110 ($88 on sale). Brand: Vogue Jewelry. Colors: 18K Yellow Gold.

Guidelines:
- Match the user's specific vibe, event, gender, style, or color request with 1 to 3 items from our catalog.
- Reference our EXACT catalog items. List their exact SKU, Name, and Brand in your explanation so the UI can highlight them dynamically!
- Explain why these specific items look stunning together or fit the user's requested occasion perfectly.
- Be highly elegant, polite, and encouraging, speaking as an elite fashion consultant.
- Format the response beautifully using Markdown with clear headings and bullet points.`;

    const userMessage = `User Request: "${prompt}"
Current Bag Items: ${JSON.stringify(currentCart || [])}
Saved Wishlist: ${JSON.stringify(wishlistProducts || [])}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const recommendationText = response.text || "No recommendations generated.";
    res.json({ success: true, text: recommendationText });
  } catch (err: any) {
    console.error("Gemini API Error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message,
      message_en: "Failed to fetch AI recommendation. Please ensure GEMINI_API_KEY is configured in Secrets panel.",
      message_ar: "فشل الحصول على توصية المنسق الذكي. يرجى التأكد من إعداد مفتاح GEMINI_API_KEY في لوحة Secrets.",
    });
  }
});

// Vite Middleware for Hot-Development & Production Serve
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express Full Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
