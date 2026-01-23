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

// Cache for available models
let availableModelsCache = null;
let modelsCacheTime = null;
const MODELS_CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Helper to get available models (with caching)
export async function getAvailableModels() {
  // Return cached models if still valid
  if (availableModelsCache && modelsCacheTime && (Date.now() - modelsCacheTime) < MODELS_CACHE_TTL) {
    return availableModelsCache;
  }

  if (!gemini || typeof gemini.listModels !== 'function') {
    // Fallback to common model names if listModels is not available
    return [
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro',
      'gemini-1.5-pro-latest',
      'gemini-pro'
    ];
  }

  try {
    const response = await gemini.listModels();
    const models = [];
    
    // Handle different response formats
    const modelList = response?.models || response || [];
    
    for (const model of modelList) {
      const name = model?.name || model;
      if (!name) continue;
      
      // Extract model name (remove 'models/' prefix if present)
      let modelName = typeof name === 'string' ? name : name.toString();
      modelName = modelName.replace(/^models\//, '');
      
      // Check if model supports generateContent
      const supportedMethods = model?.supportedGenerationMethods || model?.methods || [];
      const canGenerate = supportedMethods.includes('generateContent') || 
                         supportedMethods.includes('GENERATE_CONTENT') ||
                         !supportedMethods.length; // If no methods listed, assume it works
      
      if (canGenerate && modelName) {
        models.push(modelName);
      }
    }
    
    if (models.length > 0) {
      availableModelsCache = models;
      modelsCacheTime = Date.now();
      console.log(`Found ${models.length} available Gemini models:`, models.join(', '));
      return models;
    }
  } catch (err) {
    console.warn('Failed to list models, using fallback list:', err?.message);
  }
  
  // Fallback to common model names
  const fallback = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-1.5-pro-latest',
    'gemini-pro'
  ];
  availableModelsCache = fallback;
  modelsCacheTime = Date.now();
  return fallback;
}

export default gemini;