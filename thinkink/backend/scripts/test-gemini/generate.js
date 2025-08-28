import 'dotenv/config';
import gemini from '../../utils/geminiClient.js';




(async () => {
  if (!gemini) {
    console.error('Gemini client not configured. Check GEMINI_API_KEY in .env or environment.');
    process.exit(2);
  }

  try {
    // Use same model and call pattern as your route
    const model = gemini.getGenerativeModel?.({ model: 'gemini-1.5-flash' }) || gemini.getGenerativeModel?.({ model: 'gemini-pro' });
    if (!model) {
      console.error('This SDK build lacks getGenerativeModel(); check SDK version.');
      process.exit(3);
    }

    // generateContent pattern used in your route
    const result = await model.generateContent('Write a one-sentence friendly greeting for a blog reader.');
    // defensive: result may be different shapes; try common accessors
    const maybeResponse = result?.response ?? result;
    let text = '';
    if (maybeResponse?.text) text = typeof maybeResponse.text === 'function' ? await maybeResponse.text() : maybeResponse.text;
    if (!text && result?.candidates?.[0]) text = result.candidates[0].output ?? result.candidates[0].content ?? '';
    if (!text && typeof result === 'string') text = result;
    console.log('Generation result (trim):', (text || '<no text>').toString().slice(0,600));
  } catch (err) {
    console.error('Test generation error:', err);
    process.exit(1);
  }
})();