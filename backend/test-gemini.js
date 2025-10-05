// Simple test script to verify Gemini integration
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || 'test-key');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Test prompt
    const prompt = `Analyze this token swap and provide a brief recommendation:
    - From: AUTOX
    - To: SHIFT
    - Amount: 100
    
    Return a simple JSON response with title, description, and confidence.`;

    console.log('Testing Gemini API...');
    console.log('Prompt:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini Response:');
    console.log(text);

    // Try to parse as JSON
    try {
      const jsonResponse = JSON.parse(text);
      console.log('Parsed JSON:', jsonResponse);
    } catch (parseError) {
      console.log('Response is not valid JSON, but Gemini is working');
    }

  } catch (error) {
    console.error('Error testing Gemini:', error.message);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testGemini();
}

module.exports = { testGemini };
