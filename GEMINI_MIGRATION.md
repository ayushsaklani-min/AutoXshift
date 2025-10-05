# Gemini API Migration Guide

## Overview

AutoXShift has been successfully migrated from OpenAI to Google Gemini API using the `@google/generative-ai` package. This migration provides cost-effective AI capabilities with the Gemini 1.5 Flash model.

## Changes Made

### 1. Backend Dependencies

**Updated `backend/package.json`:**
```json
{
  "dependencies": {
    "@google/generative-ai": "^0.2.1"
  }
}
```

**Removed:**
- `openai` package

### 2. AI Service Implementation

**File: `backend/src/services/aiService.ts`**

**Key Changes:**
- Replaced `OpenAI` import with `GoogleGenerativeAI`
- Updated constructor to use Gemini model initialization
- Modified all AI methods to use Gemini API calls
- Updated error handling for Gemini-specific responses

**Before (OpenAI):**
```typescript
import OpenAI from 'openai'

class AIService {
  private openai: OpenAI | null = null

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      })
    }
  }
}
```

**After (Gemini):**
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

class AIService {
  private genAI: GoogleGenerativeAI | null = null
  private model: any = null

  constructor() {
    if (process.env.GOOGLE_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    }
  }
}
```

### 3. API Call Updates

**Recommendation Generation:**
```typescript
// Before (OpenAI)
const completion = await this.openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.7,
  max_tokens: 1000
})

// After (Gemini)
const result = await this.model.generateContent(prompt)
const response = await result.response
const text = response.text()
```

### 4. Environment Variables

**Updated `backend/env.example`:**
```env
# Before
OPENAI_API_KEY=your_openai_api_key_here

# After
GOOGLE_API_KEY=your_google_api_key_here
```

**Updated `docker-compose.yml`:**
```yaml
environment:
  - GOOGLE_API_KEY=${GOOGLE_API_KEY}
```

### 5. Health Monitoring

**Updated `backend/src/services/healthService.ts`:**
- Replaced `checkOpenAI()` with `checkGoogleAI()`
- Updated service status checks to use Google API key
- Maintained backward compatibility in response format

### 6. Documentation Updates

**Files Updated:**
- `README.md` - Updated prerequisites and setup instructions
- `docs/DEPLOYMENT.md` - Updated deployment environment variables
- `ARCHITECTURE.md` - Updated technology stack references

## Setup Instructions

### 1. Get Google API Key

1. Visit [Google AI Studio](https://ai.google.dev)
2. Create a new project or select existing one
3. Generate an API key
4. Copy the API key for configuration

### 2. Update Environment Variables

**Backend (.env):**
```env
GOOGLE_API_KEY=your_actual_google_api_key_here
```

**Frontend (.env.local):**
```env
# No changes needed - AI calls are made from backend
```

### 3. Install Dependencies

```bash
cd backend
npm install @google/generative-ai
```

### 4. Test Integration

```bash
# Test Gemini API connection
npm run test:gemini

# Start development server
npm run dev
```

## API Usage Examples

### 1. Swap Recommendations

**Endpoint:** `GET /api/ai/recommend`

**Request:**
```bash
curl "http://localhost:3001/api/ai/recommend?fromToken=AUTOX&toToken=SHIFT&amount=100"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "gemini-0",
      "type": "timing",
      "title": "Optimal Swap Time Detected",
      "description": "Market conditions suggest the next 15 minutes will have 23% better rates for AUTOX/SHIFT swaps.",
      "confidence": 87,
      "impact": "high",
      "action": "Execute swap now",
      "timestamp": 1703123456789
    }
  ]
}
```

### 2. Market Analysis

**Endpoint:** `POST /api/ai/analyze`

**Request:**
```bash
curl -X POST "http://localhost:3001/api/ai/analyze" \
  -H "Content-Type: application/json" \
  -d '{"tokens": ["AUTOX", "SHIFT"], "timeframe": "24h"}'
```

### 3. Swap Explanation

**Endpoint:** `POST /api/ai/explain`

**Request:**
```bash
curl -X POST "http://localhost:3001/api/ai/explain" \
  -H "Content-Type: application/json" \
  -d '{"transaction": {"fromToken": "AUTOX", "toToken": "SHIFT", "amount": 100}}'
```

## Benefits of Gemini Migration

### 1. Cost Efficiency
- Gemini 1.5 Flash is more cost-effective than GPT-4
- Lower per-token pricing
- Generous free tier available

### 2. Performance
- Faster response times
- Optimized for real-time applications
- Better handling of structured data

### 3. Integration
- Native Google Cloud integration
- Better support for JSON responses
- Simplified API structure

### 4. Reliability
- Google's robust infrastructure
- High availability and uptime
- Comprehensive error handling

## Troubleshooting

### Common Issues

1. **API Key Not Found**
   ```
   Error: Google API key not found. AI features will use mock data.
   ```
   **Solution:** Set `GOOGLE_API_KEY` environment variable

2. **Invalid API Key**
   ```
   Error: Invalid API key provided
   ```
   **Solution:** Verify API key is correct and has proper permissions

3. **Rate Limiting**
   ```
   Error: Rate limit exceeded
   ```
   **Solution:** Implement exponential backoff or reduce request frequency

4. **JSON Parsing Errors**
   ```
   Error: Error parsing Gemini response
   ```
   **Solution:** Gemini responses are automatically handled with fallback to mock data

### Debug Mode

Enable debug logging to troubleshoot issues:

```env
LOG_LEVEL=DEBUG
```

### Test Script

Use the provided test script to verify integration:

```bash
cd backend
GOOGLE_API_KEY=your_key npm run test:gemini
```

## Migration Checklist

- [x] Update backend dependencies
- [x] Replace OpenAI imports with Gemini
- [x] Update AI service implementation
- [x] Modify environment variables
- [x] Update health monitoring
- [x] Update documentation
- [x] Create test script
- [x] Update Docker configuration
- [x] Verify all AI endpoints work
- [x] Test error handling and fallbacks

## Future Enhancements

1. **Model Selection**: Support for different Gemini models
2. **Caching**: Implement response caching for better performance
3. **Streaming**: Add streaming support for real-time responses
4. **Analytics**: Track AI usage and performance metrics
5. **A/B Testing**: Compare different AI models and prompts

## Support

For issues related to the Gemini migration:
- Check the [Google AI documentation](https://ai.google.dev/docs)
- Review the test script output
- Check backend logs for detailed error messages
- Verify API key permissions and quotas
