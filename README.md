# AutoXShift – AI-Powered Cross-Chain Payment Router

![AutoXShift Logo](https://via.placeholder.com/800x200/1a1a1a/00ff88?text=AutoXShift)

> **AI-Powered Cross-Chain Payment Router** for seamless token swaps on Polygon Amoy testnet with intelligent route optimization and automated trading strategies.

## 🚀 Features

### Core Functionality
- **Wallet Integration**: MetaMask connection with Polygon Amoy support
- **Token Swaps**: Seamless ERC20 token exchanges via SideShift API
- **AI Optimization**: Smart recommendations for optimal swap timing and rates
- **AutoX Mode**: Automated swap scheduling based on AI predictions
- **Dashboard**: Complete wallet overview and transaction history

### AI-Powered Features
- **Smart Timing**: AI predicts optimal swap times based on market conditions
- **Rate Optimization**: Real-time analysis for best exchange rates
- **Explain My Swap**: AI chatbot explaining transaction details in simple terms
- **Gas Efficiency**: Intelligent gas price recommendations

### Technical Highlights
- **100% Self-Custodial**: No user data stored centrally
- **Polygon Amoy**: Built specifically for Polygon testnet
- **Modular Architecture**: Clean, scalable codebase
- **API Ready**: External dApp integration via `/api/swap` endpoint

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **ShadCN UI** components
- **Wagmi** for wallet integration
- **Ethers.js** for blockchain interactions

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **SideShift API** integration
- **OpenAI API** for AI features

### Blockchain
- **Polygon Amoy** testnet
- **Hardhat** for smart contract development
- **Solidity** for contract logic
- **Alchemy** RPC provider

### AI & Analytics
- **Google Gemini 1.5 Flash** for recommendations
- **Hugging Face** for additional ML models
- **Real-time** market data analysis

## 🏗️ Project Structure

```
autoxshift/
├── frontend/                 # Next.js React application
│   ├── app/                 # App router pages
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utilities and configurations
│   └── styles/              # Global styles
├── backend/                 # Express.js API server
│   ├── routes/              # API route handlers
│   ├── services/            # Business logic
│   └── utils/               # Helper functions
├── contracts/               # Smart contracts
│   ├── contracts/           # Solidity contracts
│   ├── scripts/             # Deployment scripts
│   └── test/                # Contract tests
└── docs/                    # Documentation
    ├── api/                 # API documentation
    └── contracts/           # Contract documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MetaMask wallet
- Polygon Amoy testnet tokens (get from [faucet](https://faucet.polygon.technology/))
- Google API key (optional, for AI features)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd autoxshift
npm run install:all
```

2. **Set up environment variables:**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend (.env)
GOOGLE_API_KEY=your_google_key
SIDESHIFT_API_KEY=your_sideshift_key
PORT=3001

# Contracts (.env)
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
PRIVATE_KEY=your_private_key
```

3. **Deploy smart contracts:**
```bash
npm run deploy:contracts
```

4. **Start development servers:**
```bash
npm run dev
```

5. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📱 Usage

### Basic Swap Flow
1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Select Tokens**: Choose from/to tokens (AUTOX, SHIFT, etc.)
3. **Enter Amount**: Input swap amount
4. **AI Analysis**: Review AI recommendations for optimal timing
5. **Execute Swap**: Confirm transaction and wait for confirmation
6. **View Results**: Check transaction on PolygonScan

### AutoX Mode
1. **Enable AutoX**: Toggle "Smart AutoX Mode" in settings
2. **Set Preferences**: Configure target rate and timing preferences
3. **AI Monitoring**: System continuously monitors market conditions
4. **Automatic Execution**: Swaps execute when optimal conditions are met

## 🔧 API Documentation

### Swap Endpoint
```http
POST /api/swap
Content-Type: application/json

{
  "fromToken": "AUTOX",
  "toToken": "SHIFT", 
  "amount": "100",
  "userAddress": "0x...",
  "slippage": 0.5
}
```

### AI Recommendation Endpoint
```http
GET /api/ai/recommend?from=AUTOX&to=SHIFT&amount=100
```

## 🧪 Testing

### Smart Contracts
```bash
cd contracts
npm run test
```

### Frontend
```bash
cd frontend
npm run test
```

### Backend
```bash
cd backend
npm run test
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Render)
```bash
# Connect GitHub repository to Render
# Set environment variables
# Deploy automatically on push
```

### Smart Contracts (Polygon Amoy)
```bash
cd contracts
npm run deploy:amoy
```

## 🔒 Security

- **Self-Custodial**: Users maintain full control of their funds
- **No Data Storage**: No sensitive user data stored on servers
- **Smart Contract Audits**: All contracts tested and verified
- **Rate Limiting**: API endpoints protected against abuse

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discord**: [AutoXShift Community](https://discord.gg/autoxshift)

## 🏆 Hackathon Submission

This project was built for the **SideShift API Hackathon** focusing on:
- ✅ **API Integration**: Complete SideShift API integration
- ✅ **Use Case Relevance**: Real-world DeFi utility
- ✅ **Originality**: AI-powered optimization
- ✅ **SideShift Values**: Self-custodial, crypto-native
- ✅ **Product Design**: Modern, intuitive interface
- ✅ **Presentation**: Comprehensive documentation

---

**Built with ❤️ by the AutoXShift Team**
