import express from 'express'
import { swapService } from '../services/swapService'
import { validateSwapRequest } from '../middleware/validation'
import { logger } from '../utils/logger'

const router = express.Router()

/**
 * @route POST /api/swap/quote
 * @desc Get swap quote from SideShift API
 */
router.post('/quote', validateSwapRequest, async (req: any, res: any) => {
  try {
    const { fromToken, toToken, amount, userAddress } = req.body
    
    logger.info(`Quote request: ${amount} ${fromToken} → ${toToken}`)
    
    const quote = await swapService.getSwapQuote({
      fromToken,
      toToken,
      amount: typeof amount === 'string' ? parseFloat(amount) : Number(amount),
      userAddress
    })
    
    res.json({
      success: true,
      data: quote,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('Quote error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get swap quote',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * @route POST /api/swap/execute
 * @desc Execute swap transaction
 */
router.post('/execute', validateSwapRequest, async (req: any, res: any) => {
  try {
    const { fromToken, toToken, amount, userAddress, slippage } = req.body
    
    logger.info(`Swap execution: ${amount} ${fromToken} → ${toToken}`)
    
    const result = await swapService.executeSwap({
      fromToken,
      toToken,
      amount: typeof amount === 'string' ? parseFloat(amount) : Number(amount),
      userAddress,
      slippage: slippage || 0.5
    })
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('Swap execution error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to execute swap',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * @route GET /api/swap/tokens
 * @desc Get supported tokens
 */
router.get('/tokens', async (req: any, res: any) => {
  try {
    const tokens = await swapService.getSupportedTokens()
    
    res.json({
      success: true,
      data: tokens,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('Get tokens error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get supported tokens',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * @route GET /api/swap/status/:txHash
 * @desc Get swap transaction status
 */
router.get('/status/:txHash', async (req: any, res: any) => {
  try {
    const { txHash } = req.params
    
    const status = await swapService.getSwapStatus(txHash)
    
    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('Get status error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get swap status',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * @route GET /api/swap/history/:address
 * @desc Get swap history for address
 */
router.get('/history/:address', async (req: any, res: any) => {
  try {
    const { address } = req.params
    const { limit = 50, offset = 0 } = req.query
    
    const history = await swapService.getSwapHistory(
      address,
      parseInt(limit as string, 10),
      parseInt(offset as string, 10)
    )
    
    res.json({
      success: true,
      data: history,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('Get history error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get swap history',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export { router as swapRoutes }
