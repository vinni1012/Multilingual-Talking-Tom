import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ Reads from .env
});

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" if your key has access
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that helps automate Gmail tasks.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply = chatResponse.choices[0]?.message?.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Something went wrong with OpenAI API" });
  }
});

export default router;
