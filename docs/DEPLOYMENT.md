# AutoXShift Deployment Guide

## Overview

This guide covers deploying AutoXShift to production environments, including frontend, backend, and smart contracts.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Smart         │
│   (Vercel)      │◄──►│   (Render)      │◄──►│   Contracts     │
│                 │    │                 │    │   (Polygon)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prerequisites

### Required Accounts
- [Vercel](https://vercel.com) account (frontend)
- [Render](https://render.com) account (backend)
- [Alchemy](https://alchemy.com) account (blockchain)
- [Google AI](https://ai.google.dev) account (AI features)
- [SideShift](https://sideshift.ai) account (swap API)

### Required Tools
- Node.js 18+
- Git
- MetaMask wallet
- Polygon Amoy testnet access

## Smart Contracts Deployment

### 1. Prepare Environment

```bash
cd contracts
cp env.example .env
```

Fill in your `.env` file:
```env
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
PRIVATE_KEY=your_private_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Deploy to Polygon Amoy

```bash
npm run deploy:amoy
```

### 5. Verify Contracts

```bash
npm run verify
```

### 6. Update Environment Variables

After deployment, update your environment files with the deployed contract addresses.

## Backend Deployment (Render)

### 1. Prepare Repository

Ensure your backend code is in a Git repository and pushed to GitHub.

### 2. Create Render Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the backend folder

### 3. Configure Service

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

**Environment Variables:**
```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-url.vercel.app
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
ALCHEMY_API_KEY=your_alchemy_api_key
AUTOX_TOKEN_ADDRESS=0x...
SHIFT_TOKEN_ADDRESS=0x...
SWAP_CONTRACT_ADDRESS=0x...
SIDESHIFT_API_KEY=your_sideshift_api_key
GOOGLE_API_KEY=your_google_api_key
```

### 4. Deploy

Click "Create Web Service" to deploy your backend.

## Frontend Deployment (Vercel)

### 1. Prepare Repository

Ensure your frontend code is in a Git repository and pushed to GitHub.

### 2. Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the frontend folder

### 3. Configure Build Settings

**Framework Preset:** Next.js
**Root Directory:** frontend
**Build Command:** `npm run build`
**Output Directory:** `.next`

### 4. Environment Variables

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_AUTOX_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_SHIFT_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_SWAP_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### 5. Deploy

Click "Deploy" to deploy your frontend.

## Environment Configuration

### Frontend (.env.local)

```env
# Blockchain
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_AUTOX_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_SHIFT_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_SWAP_CONTRACT_ADDRESS=0x...

# Backend
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com

# Optional
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ENV=production
```

### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=10000
LOG_LEVEL=INFO

# Frontend
FRONTEND_URL=https://your-frontend-url.vercel.app

# Blockchain
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
ALCHEMY_API_KEY=your_alchemy_api_key

# Contracts
AUTOX_TOKEN_ADDRESS=0x...
SHIFT_TOKEN_ADDRESS=0x...
SWAP_CONTRACT_ADDRESS=0x...

# APIs
SIDESHIFT_API_KEY=your_sideshift_api_key
GOOGLE_API_KEY=your_google_api_key
```

## Domain Configuration

### Custom Domain (Optional)

1. **Frontend (Vercel):**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records

2. **Backend (Render):**
   - Go to Service Settings → Custom Domains
   - Add your custom domain
   - Configure DNS records

## SSL/HTTPS

Both Vercel and Render provide automatic SSL certificates for custom domains.

## Monitoring and Analytics

### Frontend Monitoring

1. **Vercel Analytics:**
   - Built-in analytics in Vercel dashboard
   - Performance metrics
   - Error tracking

2. **Custom Analytics:**
   - Google Analytics
   - Mixpanel
   - Custom tracking

### Backend Monitoring

1. **Render Monitoring:**
   - Built-in metrics in Render dashboard
   - CPU, memory, and network usage
   - Log aggregation

2. **Custom Monitoring:**
   - Sentry for error tracking
   - DataDog for metrics
   - Custom health checks

## Database (Optional)

If you need persistent storage:

### PostgreSQL on Render

1. Create a PostgreSQL database in Render
2. Get the connection string
3. Update backend environment variables

### MongoDB Atlas

1. Create a MongoDB Atlas cluster
2. Get the connection string
3. Update backend environment variables

## CDN Configuration

### Vercel Edge Network

Vercel automatically provides global CDN for static assets.

### Custom CDN

For additional CDN needs:
- Cloudflare
- AWS CloudFront
- KeyCDN

## Security Considerations

### Environment Variables

- Never commit `.env` files to Git
- Use strong, unique API keys
- Rotate keys regularly
- Use different keys for different environments

### CORS Configuration

Ensure CORS is properly configured for production domains:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Rate Limiting

Configure appropriate rate limits for production:

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for production
  message: 'Too many requests from this IP'
});
```

## Backup and Recovery

### Database Backups

If using a database:
- Enable automatic backups
- Test restore procedures
- Store backups securely

### Code Backups

- Use Git for version control
- Tag releases
- Keep deployment history

## Scaling Considerations

### Frontend Scaling

- Vercel automatically scales
- Use CDN for static assets
- Optimize bundle size

### Backend Scaling

- Render provides auto-scaling
- Use load balancers if needed
- Monitor resource usage

### Database Scaling

- Use read replicas
- Implement connection pooling
- Monitor query performance

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check Node.js version
   - Verify all dependencies
   - Check environment variables

2. **Runtime Errors:**
   - Check logs in deployment platform
   - Verify API endpoints
   - Check network connectivity

3. **Performance Issues:**
   - Monitor resource usage
   - Optimize queries
   - Use caching

### Debugging

1. **Frontend:**
   - Use browser dev tools
   - Check network tab
   - Use Vercel function logs

2. **Backend:**
   - Check Render logs
   - Use console.log for debugging
   - Monitor API responses

## Maintenance

### Regular Tasks

1. **Update Dependencies:**
   - Check for security updates
   - Test updates in staging
   - Deploy updates

2. **Monitor Performance:**
   - Check response times
   - Monitor error rates
   - Review user feedback

3. **Backup Data:**
   - Regular database backups
   - Test restore procedures
   - Store backups securely

## Support

For deployment issues:
- GitHub Issues: https://github.com/autoxshift/deployment/issues
- Discord: https://discord.gg/autoxshift
- Email: deployment@autoxshift.com
