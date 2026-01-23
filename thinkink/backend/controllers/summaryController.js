import mongoose from "mongoose";
import Post from "../models/Post.js";
import gemini, { getAvailableModels } from "../utils/geminiClient.js";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const DEBUG = process.env.NODE_ENV === "development";

// helper: split text into chunks of approx N chars without breaking words
function chunkText(text, chunkSize = 3000) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + chunkSize, text.length);
    if (end < text.length) {
      // backtrack to nearest whitespace
      const back = text.lastIndexOf(" ", end);
      if (back > start) end = back;
    }
    chunks.push(text.slice(start, end).trim());
    start = end;
  }
  return chunks;
}

// helper: call gemini using a model candidate list and relaxed safety; always returns string
async function callGemini(prompt, opts = {}) {
  if (!gemini) {
    throw new Error("Gemini client not configured");
  }

  const { temperature = 0.3, maxOutputTokens = 512, retries = 2 } = opts;
  const hasGetModel = typeof gemini.getGenerativeModel === "function";
  if (!hasGetModel) {
    throw new Error("gemini.getGenerativeModel is not available in this SDK");
  }

  // Dynamically discover available models
  const modelNames = await getAvailableModels();
  
  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE }
  ];
  const generationConfig = { temperature, maxOutputTokens };

  // Retry logic for rate limits and model fallback
  let retryError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    // Try each model until one works
    let modelError = null;
    let result = null;
    
    for (const modelName of modelNames) {
      try {
        const modelInst = gemini.getGenerativeModel({
          model: modelName,
          safetySettings: safetySettings,
          generationConfig: generationConfig
        });
        
        if (typeof modelInst.generateContent !== 'function') {
          continue; // Skip if generateContent is not available
        }
        
        // Try to generate content with this model
        result = await modelInst.generateContent(prompt);
        break; // Success, exit model loop
      } catch (err) {
        modelError = err;
        const errorMessage = err?.message || String(err);
        const statusCode = err?.status || err?.response?.status;
        
        // If it's a 404 (model not found), try next model
        if (statusCode === 404 || errorMessage.includes('404') || errorMessage.includes('not found') || errorMessage.includes('not supported')) {
          console.log(`Model ${modelName} not available, trying next...`);
          continue; // Try next model
        }
        
        // If it's a rate limit error and we have retries left, break to retry loop
        if ((statusCode === 429 || errorMessage.includes('429') || errorMessage.includes('rate limit')) && attempt < retries) {
          retryError = err;
          break; // Break model loop to enter retry logic
        }
        
        // For other errors, throw immediately
        throw err;
      }
    }
    
    // If we got a result, process it
    if (result) {
      // Try to extract text from response
      let text = '';
      try {
        const response = result?.response;
        if (response?.text) {
          // Handle both sync and async text() methods
          text = typeof response.text === 'function' ? await response.text() : response.text;
        }
      } catch (e) {
        // If text() fails, try alternative methods
        const maybeCandidates = result?.candidates?.[0];
        if (maybeCandidates?.content?.parts?.[0]?.text) {
          text = maybeCandidates.content.parts[0].text;
        } else if (maybeCandidates?.content) {
          text = String(maybeCandidates.content);
        } else if (maybeCandidates?.output) {
          text = String(maybeCandidates.output);
        }
      }
      
      if (text && text.trim()) return text.trim();
      
      // Fallback parsing
      const maybeCandidates = result?.candidates?.[0];
      if (maybeCandidates?.content?.parts?.[0]?.text) {
        return maybeCandidates.content.parts[0].text.trim();
      }
      if (maybeCandidates?.content) return String(maybeCandidates.content).trim();
      if (maybeCandidates?.output) return String(maybeCandidates.output).trim();
      if (typeof result === 'string') return result.trim();
      
      // Last resort
      try { 
        const jsonStr = JSON.stringify(result);
        return jsonStr.length > 0 ? jsonStr : "";
      } catch { 
        return ""; 
      }
    }
    
    // If no result and we have a model error, handle rate limit retry
    if (modelError && attempt < retries) {
      const errorMessage = modelError?.message || String(modelError);
      const statusCode = modelError?.status || modelError?.response?.status;
      
      // If it's a rate limit error, wait and retry
      if (statusCode === 429 || errorMessage.includes('429') || errorMessage.includes('rate limit')) {
        retryError = modelError;
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`Rate limit hit, retrying after ${waitTime}ms (attempt ${attempt + 1}/${retries + 1})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue; // Retry with next attempt
      }
    }
    
    // If all models failed and no result, throw a helpful error
    if (!result && modelError) {
      const all404 = modelError?.status === 404 || modelError?.message?.includes('404');
      if (all404) {
        throw new Error(
          'No available Gemini models found for your API key tier. ' +
          'Please check available models at /api/ai/models or verify your API key has access to Gemini models. ' +
          'Free tier typically supports gemini-1.5-flash or gemini-pro.'
        );
      }
      throw modelError;
    }
  }
  
  // Should not reach here, but just in case
  throw retryError || new Error("Failed to generate content after retries. All models unavailable.");
}

// parse response -> plain text (defensive)
function parseGeminiResponse(res) {
  if (!res) return "";
  if (res.response && typeof res.response.text === 'function') {
    try { return res.response.text(); } catch {}
  }
  if (res.candidates && res.candidates[0]) return res.candidates[0].output ?? res.candidates[0].content ?? "";
  if (res.output && Array.isArray(res.output) && res.output[0]) {
    const o = res.output[0];
    return o.content?.[0]?.text ?? o.text ?? "";
  }
  if (res.response && res.response.output && res.response.output[0]) {
    return res.response.output[0].content?.[0]?.text ?? "";
  }
  if (res.outputText) return res.outputText;
  if (res.text) return res.text;
  if (typeof res === "string") return res;
  if (res.choices && res.choices[0]) return res.choices[0].message?.content ?? res.choices[0].text ?? "";
  try {
    return JSON.stringify(res).slice(0, 5000);
  } catch {
    return "";
  }
}

export const summarizePost = async (req, res) => {
  try {
    const { postId, force } = req.body;
    if (!postId) return res.status(400).json({ error: "postId required" });

    // Validate ObjectId format early
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      console.warn("summarizePost: invalid postId format:", postId);
      return res.status(400).json({ error: "Invalid postId format" });
    }

    console.log("summarizePost called for id:", postId, "by user:", req.user?.id);

    const post = await Post.findById(postId);
    if (!post) {
      console.warn("summarizePost: post not found for id:", postId);
      return res.status(404).json({
        error: "Post not found",
        hint: "Confirm the postId is correct and the server is connected to the expected MongoDB instance"
      });
    }

    // return cached unless forced
    if (post.summary && !force) {
      return res.json({ summary: post.summary, cached: true, summaryAt: post.summaryAt });
    }

    const content = (post.content || "").replace(/\s+/g, " ").trim();
    if (!content) return res.status(400).json({ error: "No content to summarize" });

    // chunk content to safe sizes (chars) - tune chunkSize to your model
    const chunks = chunkText(content, 1500);
    console.log(`summarizePost: post ${postId} split into ${chunks.length} chunk(s)`);

    // per-chunk summarization prompt
    const chunkSummaries = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunkPrompt = `Summarize the following article excerpt in plain, simple language in 3-4 short sentences. Keep key facts and tone neutral.\n\nExcerpt:\n${chunks[i]}\n\nSummary:`;

      let chunkRes;
      try {
        chunkRes = await callGemini(chunkPrompt, { temperature: 0.2, maxOutputTokens: 256, retries: 1 });
      } catch (err) {
        console.error(`summarizePost: Gemini chunk generation failed (chunk ${i}):`, err);
        const errorMessage = err?.message || String(err);
        const statusCode = err?.status ?? err?.response?.status;
        
        // Handle model not found errors (404) - common with free tier
        if (statusCode === 404 || errorMessage.includes('404') || errorMessage.includes('not found') || errorMessage.includes('not supported')) {
          return res.status(404).json({ 
            error: "Model not available", 
            details: "The requested model is not available for your API tier. Free tier supports 'gemini-pro' model.",
            userMessage: "⚠️ Model not available. Free tier only supports 'gemini-pro'."
          });
        }
        
        // Handle specific error types
        if (statusCode === 429 || errorMessage.includes('429') || errorMessage.includes('rate limit')) {
          return res.status(429).json({ 
            error: "Rate limit exceeded", 
            details: "Free tier rate limit reached (15 requests/minute). Please wait and try again.",
            userMessage: "⏱️ Rate limit reached. Please wait a moment before summarizing again."
          });
        }
        
        if (errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
          return res.status(503).json({ 
            error: "Quota exceeded", 
            details: "Daily quota exceeded. Please try again tomorrow.",
            userMessage: "📊 Daily quota exceeded. Please try again tomorrow."
          });
        }
        
        const details = {
          message: errorMessage,
          status: statusCode,
          errorDetails: err?.errorDetails ?? err?.response?.data ?? err
        };
        if (DEBUG) {
          return res.status(502).json({ error: "Gemini chunk generation failed", chunkIndex: i, details });
        }
        throw new Error(`Gemini chunk generation failed: ${errorMessage}`);
      }

      const text = (chunkRes || "").toString();
      chunkSummaries.push(text.trim());
      // small delay to respect rate limits, optional
      await new Promise((r) => setTimeout(r, 250));
    }

    // combine chunk summaries and ask for final concise summary
    const combined = chunkSummaries.join("\n\n");
    const finalPrompt = `You are a helpful assistant. Combine the following chunk summaries into a single clear, simple summary (3-5 sentences) suitable for a reader who wants a quick understanding. Keep factual accuracy and do not invent facts.\n\n${combined}\n\nFinal summary:`;

    let finalRes;
    try {
      finalRes = await callGemini(finalPrompt, { temperature: 0.2, maxOutputTokens: 400, retries: 1 });
    } catch (err) {
      console.error("summarizePost: Gemini final generation failed:", err);
      const errorMessage = err?.message || String(err);
      const statusCode = err?.status ?? err?.response?.status;
      
      // Handle model not found errors (404) - common with free tier
      if (statusCode === 404 || errorMessage.includes('404') || errorMessage.includes('not found') || errorMessage.includes('not supported')) {
        return res.status(404).json({ 
          error: "Model not available", 
          details: "The requested model is not available for your API tier. Free tier supports 'gemini-pro' model.",
          userMessage: "⚠️ Model not available. Free tier only supports 'gemini-pro'."
        });
      }
      
      // Handle specific error types
      if (statusCode === 429 || errorMessage.includes('429') || errorMessage.includes('rate limit')) {
        return res.status(429).json({ 
          error: "Rate limit exceeded", 
          details: "Free tier rate limit reached. Please wait and try again.",
          userMessage: "⏱️ Rate limit reached. Please wait a moment before summarizing again."
        });
      }
      
      if (errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        return res.status(503).json({ 
          error: "Quota exceeded", 
          details: "Daily quota exceeded. Please try again tomorrow.",
          userMessage: "📊 Daily quota exceeded. Please try again tomorrow."
        });
      }
      
      const details = {
        message: errorMessage,
        status: statusCode,
        errorDetails: err?.errorDetails ?? err?.response?.data ?? err
      };
      if (DEBUG) {
        return res.status(502).json({ error: "Gemini final generation failed", details });
      }
      throw new Error(`Gemini final generation failed: ${errorMessage}`);
    }
    const finalText = (finalRes || "").toString().trim();

    // save to DB
    post.summary = finalText;
    post.summaryAt = new Date();
    await post.save();

    return res.json({ summary: finalText, cached: false, summaryAt: post.summaryAt });
  } catch (err) {
    console.error("Summarize error:", err);
    const errorMessage = err?.message ?? String(err);
    const statusCode = err?.status ?? err?.response?.status ?? 500;
    
    // Handle model not found errors (404) - common with free tier
    if (statusCode === 404 || errorMessage.includes('404') || errorMessage.includes('not found') || errorMessage.includes('not supported')) {
      return res.status(404).json({ 
        error: "Model not available", 
        message: "The requested model is not available for your API tier. Free tier supports 'gemini-pro' model.",
        userMessage: "⚠️ Model not available. Free tier only supports 'gemini-pro'."
      });
    }
    
    // Handle specific error types
    if (statusCode === 429 || errorMessage.includes('429') || errorMessage.includes('rate limit')) {
      return res.status(429).json({ 
        error: "Rate limit exceeded", 
        message: "Free tier rate limit reached (15 requests/minute). Please wait and try again.",
        userMessage: "⏱️ Rate limit reached. Please wait a moment before summarizing again."
      });
    }
    
    if (errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
      return res.status(503).json({ 
        error: "Quota exceeded", 
        message: "Daily quota exceeded. Please try again tomorrow.",
        userMessage: "📊 Daily quota exceeded. Please try again tomorrow."
      });
    }
    
    const responsePayload = {
      error: "Summarization failed",
      message: errorMessage,
      userMessage: "❌ Failed to generate summary. Please try again.",
      stack: DEBUG ? err?.stack : undefined,
      raw: DEBUG ? (err?.response?.data ?? err) : undefined,
      status: statusCode
    };
    return res.status(statusCode).json(responsePayload);
  }
};