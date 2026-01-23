import 'dotenv/config';
import gemini from '../utils/geminiClient.js';

(async () => {
  if (!gemini) {
    console.error('Gemini client not configured. Ensure GEMINI_API_KEY is set in environment or .env');
    process.exit(2);
  }

  if (typeof gemini.listModels !== 'function') {
    console.error('gemini.listModels is not available in this SDK build. Check @google/generative-ai version.');
    process.exit(3);
  }

  try {
    const models = await gemini.listModels();
    console.log('Available models (trimmed):');
    try {
      console.log(JSON.stringify(models, null, 2).slice(0, 16000));
    } catch {
      console.dir(models);
    }
    process.exit(0);
  } catch (err) {
    console.error('listModels call failed:', err?.message ?? err);
    if (err?.response) console.error('response:', err.response);
    process.exit(1);
  }
})();
