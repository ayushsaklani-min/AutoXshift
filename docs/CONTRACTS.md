# AutoXShift Smart Contracts

## Overview

AutoXShift uses a set of smart contracts deployed on Polygon Amoy testnet to handle token swaps, AI optimization, and automated trading features.

## Contract Architecture

```
AutoXSwap (Main Contract)
├── AutoXToken (ERC20)
├── ShiftToken (ERC20)
└── External Dependencies
    ├── SideShift API
    └── Polygon Amoy Network
```

## Contract Addresses

**Polygon Amoy Testnet:**
- AutoXSwap: `0x...` (deployed after running deployment script)
- AutoXToken: `0x...` (deployed after running deployment script)
- ShiftToken: `0x...` (deployed after running deployment script)

## Contract Details

### AutoXSwap

The main contract that handles token swaps with AI optimization.

**Key Features:**
- Token swap execution
- Fee collection and distribution
- Slippage protection
- Quote generation
- User statistics tracking

**Functions:**

#### `executeSwap(SwapParams memory params)`
Executes a token swap with the specified parameters.

```solidity
struct SwapParams {
    address fromToken;
    address toToken;
    uint256 amountIn;
    uint256 minAmountOut;
    address recipient;
    uint256 deadline;
    uint256 slippageTolerance;
}
```

**Events:**
- `SwapExecuted(address indexed user, address indexed fromToken, address indexed toToken, uint256 amountIn, uint256 amountOut, uint256 fee, bytes32 swapId)`
- `QuoteGenerated(bytes32 indexed quoteId, address fromToken, address toToken, uint256 amountIn, uint256 amountOut)`

### AutoXToken

ERC20 token for the AutoXShift platform.

**Key Features:**
- Standard ERC20 functionality
- Minting capabilities (for testnet)
- Pausable transfers
- Minter role management

**Functions:**
- `mint(address to, uint256 amount)` - Mint new tokens (testnet only)
- `addMinter(address minter)` - Add minter role
- `removeMinter(address minter)` - Remove minter role
- `pause()` - Pause token transfers
- `unpause()` - Unpause token transfers

### ShiftToken

ERC20 token for SideShift integration.

**Key Features:**
- Standard ERC20 functionality
- Minting capabilities (for testnet)
- Pausable transfers
- Minter role management

**Functions:**
- `mint(address to, uint256 amount)` - Mint new tokens (testnet only)
- `addMinter(address minter)` - Add minter role
- `removeMinter(address minter)` - Remove minter role
- `pause()` - Pause token transfers
- `unpause()` - Unpause token transfers

## Deployment

### Prerequisites

1. Node.js 18+
2. Hardhat
3. Polygon Amoy testnet access
4. Private key with testnet MATIC

### Environment Setup

1. Copy environment file:
```bash
cp contracts/env.example contracts/.env
```

2. Fill in your configuration:
```env
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
PRIVATE_KEY=your_private_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
```

### Deploy Contracts

```bash
cd contracts
npm install
npm run deploy:amoy
```

### Verify Contracts

```bash
npm run verify
```

## Contract Interaction

### Using Ethers.js

```javascript
import { ethers } from 'ethers';

// Connect to Polygon Amoy
const provider = new ethers.JsonRpcProvider('https://rpc-amoy.polygon.technology');
const wallet = new ethers.Wallet(privateKey, provider);

// Contract ABI and address
const swapContract = new ethers.Contract(swapAddress, swapABI, wallet);

// Execute swap
const swapParams = {
    fromToken: autoXTokenAddress,
    toToken: shiftTokenAddress,
    amountIn: ethers.parseEther("100"),
    minAmountOut: ethers.parseEther("149"),
    recipient: wallet.address,
    deadline: Math.floor(Date.now() / 1000) + 3600,
    slippageTolerance: 50 // 0.5%
};

const tx = await swapContract.executeSwap(swapParams);
await tx.wait();
```

### Using Web3.js

```javascript
import Web3 from 'web3';

const web3 = new Web3('https://rpc-amoy.polygon.technology');
const contract = new web3.eth.Contract(swapABI, swapAddress);

// Execute swap
const swapParams = [
    autoXTokenAddress,
    shiftTokenAddress,
    web3.utils.toWei("100", "ether"),
    web3.utils.toWei("149", "ether"),
    walletAddress,
    Math.floor(Date.now() / 1000) + 3600,
    50
];

const tx = await contract.methods.executeSwap(swapParams).send({
    from: walletAddress,
    gas: 300000
});
```

## Security Considerations

### Access Control

- Only contract owner can pause/unpause
- Only authorized minters can mint tokens
- Fee recipient can be changed by owner

### Slippage Protection

- Users can set maximum slippage tolerance
- Minimum output amount is calculated based on slippage
- Transaction reverts if slippage exceeds tolerance

### Reentrancy Protection

- All external calls are made after state changes
- ReentrancyGuard modifier prevents reentrancy attacks

### Pausable Operations

- Critical functions can be paused in emergencies
- Pause state is checked before execution

## Testing

### Run Tests

```bash
cd contracts
npm test
```

### Test Coverage

```bash
npm run coverage
```

### Gas Usage

```bash
npm run gas-report
```

## Monitoring

### Events

Monitor contract events for:
- Swap executions
- Fee collections
- Token transfers
- Admin actions

### Metrics

Track important metrics:
- Total swap volume
- Number of swaps
- Average swap size
- Fee collection
- Gas usage

## Upgrade Path

### Current Version: v1.0.0

**Features:**
- Basic token swapping
- Fee collection
- Slippage protection
- User statistics

### Future Versions

**v1.1.0 (Planned):**
- Multi-hop routing
- Advanced slippage protection
- Batch operations

**v2.0.0 (Planned):**
- Cross-chain support
- Advanced AI integration
- Automated market making

## Troubleshooting

### Common Issues

1. **Transaction Reverted**
   - Check token allowances
   - Verify sufficient balance
   - Ensure deadline hasn't passed

2. **High Gas Usage**
   - Use gas optimization recommendations
   - Check network congestion
   - Consider batching operations

3. **Slippage Exceeded**
   - Increase slippage tolerance
   - Check market volatility
   - Consider smaller swap amounts

### Support

For contract-related issues:
- GitHub Issues: https://github.com/autoxshift/contracts/issues
- Discord: https://discord.gg/autoxshift
- Email: contracts@autoxshift.com

## License

All contracts are licensed under the MIT License. See LICENSE file for details.
