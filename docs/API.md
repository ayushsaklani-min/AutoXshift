# AutoXShift API Documentation

## Overview

The AutoXShift API provides endpoints for AI-powered cross-chain token swaps, market analysis, and optimization recommendations. All endpoints are designed to work with the Polygon Amoy testnet.

## Base URL

```
Development: http://localhost:3001/api
Production: https://api.autoxshift.com/api
```

## Authentication

Currently, no authentication is required for demo purposes. In production, API keys would be required for certain endpoints.

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Rate limit headers are included in responses

## Endpoints

### Health Check

#### GET /health
Check API health status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": 1703123456789,
    "uptime": 3600000,
    "version": "1.0.0",
    "services": {
      "database": "up",
      "sideshift": "up",
      "openai": "up",
      "polygon": "up"
    },
    "metrics": {
      "memoryUsage": 45,
      "cpuUsage": 12,
      "activeConnections": 5
    }
  }
}
```

### Swap Operations

#### POST /swap/quote
Get a quote for a token swap.

**Request Body:**
```json
{
  "fromToken": "AUTOX",
  "toToken": "SHIFT",
  "amount": 100,
  "userAddress": "0x742d35Cc6634C0532925a3b8D0C0E1C4C5f7F8F8"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fromToken": "AUTOX",
    "toToken": "SHIFT",
    "amountIn": 100,
    "amountOut": 150,
    "rate": 1.5,
    "fee": 0.3,
    "minAmountOut": 149.25,
    "priceImpact": 0.1,
    "gasEstimate": "0.001",
    "validUntil": 1703123756789
  }
}
```

#### POST /swap/execute
Execute a token swap.

**Request Body:**
```json
{
  "fromToken": "AUTOX",
  "toToken": "SHIFT",
  "amount": 100,
  "userAddress": "0x742d35Cc6634C0532925a3b8D0C0E1C4C5f7F8F8",
  "slippage": 0.5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "txHash": "0x1234567890abcdef...",
    "status": "pending",
    "gasUsed": "21000",
    "gasPrice": "30000000000",
    "blockNumber": 0,
    "timestamp": 1703123456789
  }
}
```

#### GET /swap/tokens
Get list of supported tokens.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "AUTOX",
      "name": "AutoX Token",
      "address": "0x...",
      "decimals": 18,
      "icon": "🚀",
      "price": 0.5
    }
  ]
}
```

#### GET /swap/status/:txHash
Get transaction status.

**Response:**
```json
{
  "success": true,
  "data": {
    "txHash": "0x1234567890abcdef...",
    "status": "completed",
    "gasUsed": "21000",
    "gasPrice": "30000000000",
    "blockNumber": 12345,
    "timestamp": 1703123456789
  }
}
```

#### GET /swap/history/:address
Get swap history for an address.

**Query Parameters:**
- `limit` (optional): Number of transactions to return (default: 50)
- `offset` (optional): Number of transactions to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "txHash": "0x1234567890abcdef...",
      "status": "completed",
      "gasUsed": "21000",
      "gasPrice": "30000000000",
      "blockNumber": 12345,
      "timestamp": 1703123456789
    }
  ]
}
```

### AI Operations

#### GET /ai/recommend
Get AI recommendations for swap optimization.

**Query Parameters:**
- `fromToken`: Source token symbol
- `toToken`: Destination token symbol
- `amount`: Amount to swap

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "type": "timing",
      "title": "Optimal Swap Time Detected",
      "description": "Market conditions suggest the next 15 minutes will have 23% better rates.",
      "confidence": 87,
      "impact": "high",
      "action": "Execute swap now",
      "timestamp": 1703123456789
    }
  ]
}
```

#### POST /ai/analyze
Analyze market conditions for tokens.

**Request Body:**
```json
{
  "tokens": ["AUTOX", "SHIFT"],
  "timeframe": "24h"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overallSentiment": "bullish",
    "volatility": "medium",
    "recommendations": [...],
    "insights": [
      "Trading volume increased 15% in the last 24 hours",
      "Price momentum suggests continued upward movement"
    ],
    "optimalTiming": {
      "bestTime": "Next 2-4 hours",
      "confidence": 85,
      "reason": "Market volatility is low and liquidity is high"
    }
  }
}
```

#### POST /ai/explain
Get AI explanation of a swap transaction.

**Request Body:**
```json
{
  "transaction": {
    "fromToken": "AUTOX",
    "toToken": "SHIFT",
    "amount": 100,
    "rate": 1.5,
    "fee": 0.3,
    "slippage": 0.5
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": "Your AUTOX to SHIFT swap will execute at a 1.5x exchange rate. The 0.3% fee covers network costs and liquidity provider rewards. With current gas prices, your transaction should confirm within 2-3 minutes. The 0.5% slippage tolerance protects against small price movements during execution."
}
```

#### GET /ai/optimize
Get gas optimization recommendations.

**Query Parameters:**
- `network` (optional): Network name (default: "polygon-amoy")

**Response:**
```json
{
  "success": true,
  "data": {
    "currentGasPrice": "30",
    "recommendedGasPrice": "25",
    "savings": "16.7%",
    "estimatedConfirmationTime": "2-3 minutes",
    "recommendations": [
      "Gas prices are currently 16% below average",
      "Consider executing within the next 15 minutes"
    ]
  }
}
```

#### POST /ai/autox
Configure AutoX mode settings.

**Request Body:**
```json
{
  "userAddress": "0x742d35Cc6634C0532925a3b8D0C0E1C4C5f7F8F8",
  "settings": {
    "enabled": true,
    "targetRate": 1.6,
    "maxSlippage": 1.0,
    "gasThreshold": 25,
    "checkInterval": 300000
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "settings": {...},
    "triggers": [
      "Rate improvement > 5%",
      "Gas price < 20 gwei",
      "Market volatility < 2%"
    ],
    "nextCheck": 1703123756789
  }
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description",
  "timestamp": "2023-12-21T10:30:00.000Z"
}
```

### Common HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation error)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `503` - Service Unavailable

## SDK Examples

### JavaScript/TypeScript

```javascript
// Get swap quote
const response = await fetch('http://localhost:3001/api/swap/quote', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fromToken: 'AUTOX',
    toToken: 'SHIFT',
    amount: 100,
    userAddress: '0x742d35Cc6634C0532925a3b8D0C0E1C4C5f7F8F8'
  })
});

const quote = await response.json();
```

### Python

```python
import requests

# Get AI recommendations
response = requests.get(
    'http://localhost:3001/api/ai/recommend',
    params={
        'fromToken': 'AUTOX',
        'toToken': 'SHIFT',
        'amount': 100
    }
)

recommendations = response.json()
```

## WebSocket Support

Real-time updates for swap status and AI recommendations are available via WebSocket:

```javascript
const ws = new WebSocket('ws://localhost:3001/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Real-time update:', data);
};
```

## Rate Limits

- **Free Tier**: 100 requests per 15 minutes
- **Pro Tier**: 1000 requests per 15 minutes
- **Enterprise**: Custom limits

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

## Support

For API support and questions:
- Email: api@autoxshift.com
- Documentation: https://docs.autoxshift.com
- GitHub: https://github.com/autoxshift/api
