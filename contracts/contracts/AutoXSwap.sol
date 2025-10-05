// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AutoXSwap
 * @dev Smart contract for handling token swaps with AI optimization
 * @notice Integrates with SideShift API for cross-chain swaps
 */
contract AutoXSwap is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    struct SwapParams {
        address fromToken;
        address toToken;
        uint256 amountIn;
        uint256 minAmountOut;
        address recipient;
        uint256 deadline;
        uint256 slippageTolerance; // in basis points (100 = 1%)
    }
    
    struct SwapQuote {
        address fromToken;
        address toToken;
        uint256 amountIn;
        uint256 amountOut;
        uint256 fee;
        uint256 timestamp;
        bool isValid;
    }
    
    // State variables
    mapping(address => bool) public supportedTokens;
    mapping(bytes32 => SwapQuote) public swapQuotes;
    mapping(address => uint256) public totalSwaps;
    mapping(address => uint256) public totalVolume;
    
    uint256 public constant MAX_SLIPPAGE = 1000; // 10%
    uint256 public constant FEE_BASIS_POINTS = 30; // 0.3%
    uint256 public constant QUOTE_EXPIRY = 300; // 5 minutes
    
    address public feeRecipient;
    uint256 public totalFeesCollected;
    
    // Events
    event TokenSupported(address indexed token, bool supported);
    event SwapExecuted(
        address indexed user,
        address indexed fromToken,
        address indexed toToken,
        uint256 amountIn,
        uint256 amountOut,
        uint256 fee,
        bytes32 swapId
    );
    event QuoteGenerated(
        bytes32 indexed quoteId,
        address fromToken,
        address toToken,
        uint256 amountIn,
        uint256 amountOut
    );
    event FeeCollected(address indexed token, uint256 amount);
    
  constructor(address _feeRecipient) Ownable(msg.sender) {
    feeRecipient = _feeRecipient;
  }
    
    /**
     * @dev Add or remove supported token
     * @param token Token address
     * @param supported Whether token is supported
     */
    function setSupportedToken(address token, bool supported) external onlyOwner {
        supportedTokens[token] = supported;
        emit TokenSupported(token, supported);
    }
    
    /**
     * @dev Set fee recipient
     * @param _feeRecipient New fee recipient address
     */
    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        feeRecipient = _feeRecipient;
    }
    
    /**
     * @dev Generate a swap quote
     * @param fromToken Source token address
     * @param toToken Destination token address
     * @param amountIn Input amount
     * @return quoteId Unique quote identifier
     */
    function generateQuote(
        address fromToken,
        address toToken,
        uint256 amountIn
    ) external view returns (bytes32 quoteId) {
        require(supportedTokens[fromToken], "AutoXSwap: fromToken not supported");
        require(supportedTokens[toToken], "AutoXSwap: toToken not supported");
        require(amountIn > 0, "AutoXSwap: invalid amount");
        
        // In a real implementation, this would call SideShift API
        // For now, we'll simulate a quote with a simple calculation
        uint256 amountOut = _simulateSwap(fromToken, toToken, amountIn);
        uint256 fee = (amountIn * FEE_BASIS_POINTS) / 10000;
        
        quoteId = keccak256(abi.encodePacked(
            fromToken,
            toToken,
            amountIn,
            block.timestamp,
            block.number
        ));
        
        // Note: In a real implementation, you would store this quote
        // For demo purposes, we'll just return the quoteId
    }
    
    /**
     * @dev Execute a swap
     * @param params Swap parameters
     * @return swapId Unique swap identifier
     */
    function executeSwap(SwapParams memory params) 
        external 
        nonReentrant 
        whenNotPaused 
        returns (bytes32 swapId) 
    {
        require(supportedTokens[params.fromToken], "AutoXSwap: fromToken not supported");
        require(supportedTokens[params.toToken], "AutoXSwap: toToken not supported");
        require(params.amountIn > 0, "AutoXSwap: invalid amount");
        require(params.deadline >= block.timestamp, "AutoXSwap: deadline passed");
        require(params.slippageTolerance <= MAX_SLIPPAGE, "AutoXSwap: slippage too high");
        
        // Calculate expected output
        uint256 expectedOut = _simulateSwap(params.fromToken, params.toToken, params.amountIn);
        require(expectedOut >= params.minAmountOut, "AutoXSwap: insufficient output");
        
        // Calculate fee
        uint256 fee = (params.amountIn * FEE_BASIS_POINTS) / 10000;
        uint256 amountAfterFee = params.amountIn - fee;
        
        // Transfer tokens from user
        IERC20(params.fromToken).safeTransferFrom(
            msg.sender,
            address(this),
            params.amountIn
        );
        
        // In a real implementation, this would call SideShift API
        // For demo purposes, we'll simulate the swap
        uint256 actualOut = _simulateSwap(params.fromToken, params.toToken, amountAfterFee);
        
        // Transfer output tokens to recipient
        IERC20(params.toToken).safeTransfer(params.recipient, actualOut);
        
        // Transfer fee to fee recipient
        if (fee > 0) {
            IERC20(params.fromToken).safeTransfer(feeRecipient, fee);
            totalFeesCollected += fee;
            emit FeeCollected(params.fromToken, fee);
        }
        
        // Update statistics
        totalSwaps[msg.sender]++;
        totalVolume[msg.sender] += params.amountIn;
        
        // Generate swap ID
        swapId = keccak256(abi.encodePacked(
            msg.sender,
            params.fromToken,
            params.toToken,
            params.amountIn,
            actualOut,
            block.timestamp
        ));
        
        emit SwapExecuted(
            msg.sender,
            params.fromToken,
            params.toToken,
            params.amountIn,
            actualOut,
            fee,
            swapId
        );
    }
    
    /**
     * @dev Simulate a swap (mock implementation)
     * @param fromToken Source token
     * @param toToken Destination token
     * @param amountIn Input amount
     * @return amountOut Output amount
     */
    function _simulateSwap(
        address fromToken,
        address toToken,
        uint256 amountIn
    ) internal pure returns (uint256 amountOut) {
        // Mock exchange rate: 1:1.5 (AUTOX:SHIFT)
        // In reality, this would be fetched from SideShift API
        if (fromToken < toToken) {
            amountOut = (amountIn * 150) / 100; // 1.5x rate
        } else {
            amountOut = (amountIn * 100) / 150; // Inverse rate
        }
    }
    
    /**
     * @dev Get user statistics
     * @param user User address
     * @return swaps Total number of swaps
     * @return volume Total volume swapped
     */
    function getUserStats(address user) external view returns (uint256 swaps, uint256 volume) {
        return (totalSwaps[user], totalVolume[user]);
    }
    
    /**
     * @dev Emergency pause
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency withdraw tokens
     * @param token Token address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
}
