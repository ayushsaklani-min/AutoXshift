# AutoXShift Architecture

## System Overview

AutoXShift is a decentralized web application that provides AI-powered cross-chain token swaps on the Polygon Amoy testnet. The system consists of three main components: a Next.js frontend, a Node.js backend API, and Solidity smart contracts.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   MetaMask      │  │   Web Browser   │  │   Mobile App    │ │
│  │   Wallet        │  │   (Next.js)     │  │   (Future)      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                    Frontend Layer                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Wallet        │  │   Swap Panel    │  │   AI Analysis   │ │
│  │   Connection    │  │   Interface     │  │   Dashboard     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Portfolio     │  │   Transaction   │  │   Settings      │ │
│  │   Overview      │  │   History       │  │   & Config      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTP/WebSocket
┌─────────────────────▼───────────────────────────────────────────┐
│                    Backend API Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Swap Service  │  │   AI Service    │  │   Health        │ │
│  │   (SideShift)   │  │   (OpenAI)      │  │   Monitoring    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Rate          │  │   Validation    │  │   Error         │ │
│  │   Limiting      │  │   Middleware    │  │   Handling      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                    Blockchain Layer                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   AutoXSwap     │  │   AutoXToken    │  │   ShiftToken    │ │
│  │   Contract      │  │   (ERC20)       │  │   (ERC20)       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Polygon       │  │   SideShift     │  │   External      │ │
│  │   Amoy Network  │  │   API           │  │   APIs          │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (Next.js 14)

**Technology Stack:**
- Next.js 14 with App Router
- React 18 with TypeScript
- TailwindCSS for styling
- ShadCN UI components
- Wagmi for wallet integration
- Ethers.js for blockchain interactions

**Key Features:**
- Wallet connection (MetaMask)
- Token swap interface
- AI recommendation dashboard
- Portfolio overview
- Transaction history
- Real-time updates

**File Structure:**
```
frontend/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── demo/              # Demo page
│   └── providers.tsx      # Context providers
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Header.tsx        # Navigation header
│   ├── SwapPanel.tsx     # Main swap interface
│   ├── AIRecommendation.tsx # AI analysis
│   ├── WalletOverview.tsx   # Portfolio view
│   └── SwapHistory.tsx      # Transaction history
├── lib/                  # Utilities
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

### Backend (Node.js/Express)

**Technology Stack:**
- Node.js with Express
- TypeScript for type safety
- Axios for HTTP requests
- Google Gemini API integration
- Ethers.js for blockchain
- Joi for validation

**Key Features:**
- RESTful API endpoints
- SideShift API integration
- AI recommendation engine
- Rate limiting and security
- Health monitoring
- Error handling

**File Structure:**
```
backend/
├── src/
│   ├── routes/           # API route handlers
│   │   ├── swap.ts      # Swap operations
│   │   ├── ai.ts        # AI features
│   │   └── health.ts    # Health checks
│   ├── services/        # Business logic
│   │   ├── swapService.ts    # Swap operations
│   │   ├── aiService.ts      # AI features
│   │   └── healthService.ts  # Health monitoring
│   ├── middleware/      # Express middleware
│   │   ├── errorHandler.ts   # Error handling
│   │   └── validation.ts     # Request validation
│   ├── utils/           # Utilities
│   │   └── logger.ts    # Logging
│   └── index.ts         # Main server file
└── dist/                # Compiled JavaScript
```

### Smart Contracts (Solidity)

**Technology Stack:**
- Solidity 0.8.19
- Hardhat development framework
- OpenZeppelin contracts
- Ethers.js for deployment

**Key Features:**
- ERC20 token contracts
- Swap execution logic
- Fee collection
- Slippage protection
- Access control
- Pausable operations

**File Structure:**
```
contracts/
├── contracts/           # Solidity contracts
│   ├── AutoXToken.sol  # AUTOX token
│   ├── ShiftToken.sol  # SHIFT token
│   └── AutoXSwap.sol   # Main swap contract
├── scripts/            # Deployment scripts
│   └── deploy.js       # Contract deployment
├── test/               # Contract tests
│   └── AutoXSwap.test.js
└── deployments/        # Deployment artifacts
    └── amoy.json       # Polygon Amoy deployment
```

## Data Flow

### 1. User Initiates Swap

```
User → Frontend → Backend → SideShift API → Smart Contract → Polygon Network
```

1. User connects wallet and selects tokens
2. Frontend requests quote from backend
3. Backend calls SideShift API for pricing
4. AI service analyzes optimal timing
5. User approves transaction
6. Smart contract executes swap
7. Transaction confirmed on Polygon

### 2. AI Recommendation Flow

```
Market Data → AI Service → Analysis → Frontend → User
```

1. AI service monitors market conditions
2. Analyzes token prices and volatility
3. Generates recommendations using OpenAI
4. Sends insights to frontend
5. User sees AI suggestions in dashboard

### 3. Portfolio Tracking

```
Blockchain → Backend → Database → Frontend → User
```

1. Backend monitors user transactions
2. Calculates portfolio metrics
3. Stores data (in-memory for demo)
4. Frontend displays real-time updates
5. User sees portfolio performance

## Security Architecture

### Frontend Security
- No sensitive data stored locally
- All transactions signed by user wallet
- HTTPS enforcement
- Content Security Policy headers
- Input validation and sanitization

### Backend Security
- Rate limiting on all endpoints
- Input validation with Joi
- CORS configuration
- Helmet.js security headers
- Error handling without data leakage
- API key management

### Smart Contract Security
- Reentrancy protection
- Access control with OpenZeppelin
- Pausable operations
- Slippage protection
- Input validation
- Emergency withdrawal functions

## Scalability Considerations

### Frontend Scaling
- Static site generation (SSG)
- CDN distribution via Vercel
- Image optimization
- Code splitting
- Lazy loading

### Backend Scaling
- Horizontal scaling with load balancers
- Database connection pooling
- Caching with Redis
- Microservices architecture
- Container orchestration

### Blockchain Scaling
- Layer 2 solutions (Polygon)
- Batch transactions
- Gas optimization
- State channels (future)
- Cross-chain bridges

## Monitoring and Observability

### Application Metrics
- Response times
- Error rates
- Throughput
- User engagement
- Transaction success rates

### Infrastructure Metrics
- CPU and memory usage
- Network I/O
- Database performance
- Cache hit rates
- API response times

### Business Metrics
- Swap volume
- User acquisition
- Revenue tracking
- AI recommendation accuracy
- Gas savings achieved

## Deployment Architecture

### Development Environment
```
Local Machine
├── Frontend (localhost:3000)
├── Backend (localhost:3001)
├── Hardhat Network
└── MetaMask (Polygon Amoy)
```

### Production Environment
```
Internet
├── Vercel (Frontend)
├── Render (Backend)
├── Polygon Amoy (Contracts)
├── Alchemy (RPC)
└── External APIs (SideShift, OpenAI)
```

### Container Deployment
```
Docker Compose
├── Frontend Container
├── Backend Container
├── Nginx Reverse Proxy
├── PostgreSQL Database
└── Redis Cache
```

## Future Enhancements

### Phase 2: Cross-Chain Support
- Multi-chain token swaps
- Bridge integrations
- Cross-chain AI optimization
- Universal routing

### Phase 3: Advanced AI
- Machine learning models
- Predictive analytics
- Automated trading strategies
- Risk assessment algorithms

### Phase 4: DeFi Integration
- Liquidity provision
- Yield farming
- Staking mechanisms
- Governance tokens

## Technology Decisions

### Why Next.js?
- Server-side rendering for SEO
- Built-in optimization
- Excellent developer experience
- Strong ecosystem

### Why Express.js?
- Lightweight and fast
- Extensive middleware ecosystem
- Easy to scale
- Good TypeScript support

### Why Solidity?
- Industry standard for Ethereum
- Mature tooling
- Large developer community
- Security best practices

### Why Polygon?
- Low transaction costs
- Fast confirmation times
- Ethereum compatibility
- Growing ecosystem

## Performance Optimizations

### Frontend
- Code splitting and lazy loading
- Image optimization
- Bundle size optimization
- Caching strategies
- Progressive Web App features

### Backend
- Database query optimization
- Caching with Redis
- Connection pooling
- Async processing
- Rate limiting

### Smart Contracts
- Gas optimization
- Batch operations
- Efficient data structures
- Minimal external calls
- Event-driven architecture
