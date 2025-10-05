import express from 'express'
import { aiService } from '../services/aiService'
import { logger } from '../utils/logger'

const router = express.Router()

/**
 * @route GET /api/ai/recommend
 * @desc Get AI recommendations for swap timing and optimization
 */
router.get('/recommend', async (req: any, res: any) => {
  try {
    const { fromToken, toToken, amount } = req.query
    
    if (!fromToken || !toToken || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        message: 'fromToken, toToken, and amount are required'
      })
    }
    
    logger.info(`AI recommendation request: ${amount} ${fromToken} → ${toToken}`)
    
    const recommendations = await aiService.getSwapRecommendations({
      fromToken: fromToken as string,
      toToken: toToken as string,
      amount: parseFloat(amount as string)
    })
    
    res.json({
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('AI recommendation error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get AI recommendations',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * @route POST /api/ai/analyze
 * @desc Analyze market conditions and provide insights
 */
router.post('/analyze', async (req: any, res: any) => {
  try {
    const { tokens, timeframe = '24h' } = req.body
    
    if (!tokens || !Array.isArray(tokens)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'tokens array is required'
      })
    }
    
    logger.info(`AI analysis request for tokens: ${tokens.join(', ')}`)
    
    const analysis = await aiService.analyzeMarketConditions(tokens, timeframe)
    
    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('AI analysis error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to analyze market conditions',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * @route POST /api/ai/explain
 * @desc Get AI explanation of swap transaction
 */
router.post('/explain', async (req: any, res: any) => {
  try {
    const { transaction } = req.body
    
    if (!transaction) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'transaction object is required'
      })
    }
    
    logger.info('AI explanation request for transaction')
    
    const explanation = await aiService.explainSwap(transaction)
    
    res.json({
      success: true,
      data: explanation,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('AI explanation error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to explain swap',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * @route GET /api/ai/optimize
 * @desc Get gas optimization recommendations
 */
router.get('/optimize', async (req: any, res: any) => {
  try {
    const { network = 'polygon-amoy' } = req.query
    
    logger.info(`Gas optimization request for network: ${network}`)
    
    const optimization = await aiService.getGasOptimization(network as string)
    
    res.json({
      success: true,
      data: optimization,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('Gas optimization error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get gas optimization',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * @route POST /api/ai/autox
 * @desc Configure AutoX mode settings
 */
router.post('/autox', async (req: any, res: any) => {
  try {
    const { userAddress, settings } = req.body
    
    if (!userAddress || !settings) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'userAddress and settings are required'
      })
    }
    
    logger.info(`AutoX configuration request for user: ${userAddress}`)
    
    const result = await aiService.configureAutoXMode(userAddress, settings)
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('AutoX configuration error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to configure AutoX mode',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export { router as aiRoutes }
