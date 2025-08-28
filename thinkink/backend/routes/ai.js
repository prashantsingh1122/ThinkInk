// routes/ai.js
import express from 'express';
// Use the shared Gemini client
import OpenAI from 'openai';
import { summarizePost } from '../controllers/summaryController.js';
import { protect } from "../middleware/authMiddleware.js";
import gemini from "../utils/geminiClient.js";

const router = express.Router();

// Validate Gemini client
const genAI = gemini || null;
if (!genAI) {
  console.error('Gemini client is not configured; set GEMINI_API_KEY');
}

// Optional OpenAI fallback
const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

//summarize route
router.post('/summarize',protect,summarizePost)

router.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  if (!genAI && !openai) {
    return res.status(503).json({
      error: 'AI service is not configured',
      details: 'Set GEMINI_API_KEY or OPENAI_API_KEY in backend environment and restart the server.'
    });
  }

  try {
    if (genAI) {
      // Try Gemini first
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
        return res.json({ content: text, provider: 'gemini', model: 'gemini-1.5-flash' });
      } catch (primaryErr) {
        console.warn('Gemini primary model failed, trying fallback model:', primaryErr?.message);
        try {
          const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
          const result = await fallbackModel.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          return res.json({ content: text, provider: 'gemini', model: 'gemini-pro' });
        } catch (secondaryErr) {
          console.warn('Gemini fallback failed:', secondaryErr?.message);
          // fall through to OpenAI if available
        }
      }
    }

    if (openai) {
      // OpenAI fallback
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that writes clear, structured blog content.' },
            { role: 'user', content: prompt }
          ]
        });
        const text = completion.choices?.[0]?.message?.content?.trim();
        if (text) return res.json({ content: text, provider: 'openai', model: 'gpt-4o-mini' });
      } catch (openaiPrimaryErr) {
        console.warn('OpenAI primary model failed, trying gpt-3.5-turbo:', openaiPrimaryErr?.message);
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that writes clear, structured blog content.' },
            { role: 'user', content: prompt }
          ]
        });
        const text = completion.choices?.[0]?.message?.content?.trim();
        if (text) return res.json({ content: text, provider: 'openai', model: 'gpt-3.5-turbo' });
      }
    }

    // If we got here, both providers failed
    throw new Error('All AI providers failed to generate content');
  } catch (err) {
    console.error("🔥 Gemini API Error:", err);
    // More detailed error response
    res.status(500).json({ 
      error: "AI content generation failed", 
      details: err?.message || 'Unknown error',
      status: err?.response?.status,
      data: err?.response?.data,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

export default router;
