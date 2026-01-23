// routes/ai.js
import express from 'express';
// Use the shared Gemini client
import { summarizePost } from '../controllers/summaryController.js';
import { protect } from "../middleware/authMiddleware.js";
import gemini, { getAvailableModels } from "../utils/geminiClient.js";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const router = express.Router();

// Validate Gemini client
const genAI = gemini || null;
if (!genAI) {
  console.error('Gemini client is not configured; set GEMINI_API_KEY');
}


//summarize route
router.post('/summarize', protect, summarizePost)

// Generate content using Gemini 1.5 Flash only

router.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  if (!genAI) {
    return res.status(503).json({
      error: 'Gemini AI service is not configured',
      details: 'Set GEMINI_API_KEY in backend environment and restart the server.'
    });
  }

  try {
    // Dynamically discover available models
    const modelNames = await getAvailableModels();
    console.log(`Trying ${modelNames.length} available models for generation...`);
    
    let result;
    let lastError;
    let usedModel = null;
    
    // Try each model until one works
    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
          ]
        });
        result = await model.generateContent(prompt);
        usedModel = modelName;
        break; // Success, exit loop
      } catch (err) {
        lastError = err;
        // If it's a 404 (model not found), try next model
        if (err?.status === 404 || err?.message?.includes('404') || err?.message?.includes('not found')) {
          console.log(`Model ${modelName} not available, trying next...`);
          continue;
        }
        // For other errors, throw immediately
        throw err;
      }
    }
    
    if (!result) {
      const all404 = lastError?.status === 404 || lastError?.message?.includes('404');
      if (all404) {
        throw new Error(
          'No available Gemini models found for your API key tier. ' +
          'Please check available models at /api/ai/models or verify your API key has access to Gemini models. ' +
          'Free tier typically supports gemini-1.5-flash or gemini-pro.'
        );
      }
      throw lastError || new Error('All model attempts failed');
    }
    const response = result.response;
    
    // Handle text extraction - text() might be async or sync depending on SDK version
    let text = '';
    if (response?.text) {
      text = typeof response.text === 'function' ? await response.text() : response.text;
    }
    
    // Fallback to candidates if text() doesn't work
    if (!text && result?.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = result.candidates[0].content.parts[0].text;
    }
    
    if (!text) {
      throw new Error('No text content received from Gemini API');
    }
    
    return res.json({ 
      content: text, 
      provider: 'gemini', 
      model: usedModel || 'unknown' 
    });
  } catch (err) {
    console.error("Gemini generation error:", err);
    
    // Handle specific Gemini API errors
    const errorMessage = err?.message || String(err);
    const statusCode = err?.status || err?.response?.status || 500;
    
    // Check for model not found errors (404) - common with free tier
    if (statusCode === 404 || errorMessage.includes('404') || errorMessage.includes('not found') || errorMessage.includes('not supported')) {
      return res.status(404).json({ 
        error: "Model not available", 
        details: "The requested model is not available for your API tier. Free tier supports 'gemini-pro' model.",
        userMessage: "⚠️ Model not available. Free tier only supports 'gemini-pro'. Please check your API key tier or upgrade your plan.",
        suggestion: "Try using 'gemini-pro' model instead."
      });
    }
    
    // Check for rate limit errors (429)
    if (statusCode === 429 || errorMessage.includes('429') || errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
      return res.status(429).json({ 
        error: "Rate limit exceeded", 
        details: "You've hit the free tier rate limit (15 requests/minute). Please wait a moment and try again.",
        userMessage: "⏱️ Rate limit reached. Free tier allows 15 requests per minute. Please wait and try again.",
        retryAfter: 60
      });
    }
    
    // Check for quota exceeded errors
    if (errorMessage.includes('quota') || errorMessage.includes('Quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
      return res.status(503).json({ 
        error: "Quota exceeded", 
        details: "Your free tier quota has been exceeded. Please check your Gemini API quota or upgrade your plan.",
        userMessage: "📊 Daily quota exceeded. Free tier has limited requests per day. Please try again tomorrow or upgrade your API plan."
      });
    }
    
    // Check for API key errors
    if (errorMessage.includes('API_KEY') || errorMessage.includes('401') || errorMessage.includes('403') || statusCode === 401 || statusCode === 403) {
      return res.status(401).json({ 
        error: "API key error", 
        details: "Invalid or expired Gemini API key. Please check your GEMINI_API_KEY.",
        userMessage: "🔑 API key issue. Please verify your Gemini API key is valid and active."
      });
    }
    
    // Check for blocked content errors
    if (errorMessage.includes('blocked') || errorMessage.includes('safety') || errorMessage.includes('SAFETY')) {
      return res.status(400).json({ 
        error: "Content blocked", 
        details: "The generated content was blocked by safety filters. Try rephrasing your prompt.",
        userMessage: "🚫 Content blocked by safety filters. Please try a different prompt."
      });
    }
    
    // Generic error response
    return res.status(statusCode).json({ 
      error: "AI content generation failed", 
      details: errorMessage,
      userMessage: "❌ Failed to generate content. Please try again or check your API key.",
      status: statusCode,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Debug route: GET /api/ai/models
router.get('/models', async (req, res) => {
  if (!genAI || typeof genAI.listModels !== 'function') {
    return res.status(501).json({ error: 'Gemini listModels not available in this SDK' });
  }
  try {
    const models = await genAI.listModels();
    return res.json({ models });
  } catch (err) {
    console.error('listModels failed:', err);
    return res.status(500).json({ error: 'listModels failed', details: err?.message ?? err });
  }
});

export default router;
