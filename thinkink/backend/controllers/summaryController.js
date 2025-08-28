import mongoose from "mongoose";
import Post from "../models/Post.js";
import gemini from "../utils/geminiClient.js";
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

// helper: call gemini using a fixed model and relaxed safety; always returns string
async function callGemini(prompt, opts = {}) {
  if (!gemini) {
    throw new Error("Gemini client not configured");
  }

  const { temperature = 0.3, maxOutputTokens = 512 } = opts;
  const hasGetModel = typeof gemini.getGenerativeModel === "function";
  if (!hasGetModel) {
    throw new Error("gemini.getGenerativeModel is not available in this SDK");
  }
  const modelInst = gemini.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE }
    ],
    generationConfig: { temperature, maxOutputTokens }
  });

  if (typeof modelInst.generateContent !== "function") {
    throw new Error("model.generateContent is not available in this SDK");
  }
  const result = await modelInst.generateContent(prompt);
  const text = await (result?.response?.text?.() ?? "");
  if (text) return text;
  const maybeCandidates = result?.candidates?.[0];
  if (maybeCandidates?.content) return String(maybeCandidates.content);
  if (maybeCandidates?.output) return String(maybeCandidates.output);
  if (typeof result === 'string') return result;
  try { return JSON.stringify(result); } catch { return ""; }
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
        chunkRes = await callGemini(chunkPrompt, { temperature: 0.2, maxOutputTokens: 256 });
      } catch (err) {
        console.error(`summarizePost: Gemini chunk generation failed (chunk ${i}):`, err);
        const details = {
          message: err?.message,
          status: err?.status ?? err?.response?.status,
          errorDetails: err?.errorDetails ?? err?.response?.data ?? err
        };
        if (DEBUG) {
          return res.status(502).json({ error: "Gemini chunk generation failed", chunkIndex: i, details });
        }
        throw new Error("Gemini chunk generation failed");
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
      finalRes = await callGemini(finalPrompt, { temperature: 0.2, maxOutputTokens: 400 });
    } catch (err) {
      console.error("summarizePost: Gemini final generation failed:", err);
      const details = {
        message: err?.message,
        status: err?.status ?? err?.response?.status,
        errorDetails: err?.errorDetails ?? err?.response?.data ?? err
      };
      if (DEBUG) {
        return res.status(502).json({ error: "Gemini final generation failed", details });
      }
      throw new Error("Gemini final generation failed");
    }
    const finalText = (finalRes || "").toString().trim();

    // save to DB
    post.summary = finalText;
    post.summaryAt = new Date();
    await post.save();

    return res.json({ summary: finalText, cached: false, summaryAt: post.summaryAt });
  } catch (err) {
    console.error("Summarize error:", err);
    const responsePayload = {
      error: "Summarization failed",
      message: err?.message ?? String(err),
      stack: err?.stack,
      raw: err?.response?.data ?? err,
      status: err?.status ?? err?.response?.status
    };
    return res.status(500).json(responsePayload);
  }
};