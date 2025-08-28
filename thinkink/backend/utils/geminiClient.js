import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load env for both .env.local then .env so local overrides take effect
dotenv.config({ path: '.env.local' });
dotenv.config();

// Initialize Gemini client once; sanitize key and use string constructor for SDK compat
let gemini = null;
let apiKey = process.env.GEMINI_API_KEY ?? "";
apiKey = apiKey.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
if (apiKey) {
  try {
    gemini = new GoogleGenerativeAI(apiKey);
    console.log('Gemini client configured (partial):', apiKey.slice(0,4)+'...'+apiKey.slice(-4));
  } catch (err) {
    console.error('Failed to initialize GoogleGenerativeAI SDK:', err?.message || err);
  }
} else {
  console.warn('GEMINI_API_KEY not set; Gemini client not configured.');
}

export default gemini;