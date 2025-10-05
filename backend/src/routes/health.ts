import express from 'express'
import { healthService } from '../services/healthService'
import { logger } from '../utils/logger'

const router = express.Router()

/**
 * @route GET /api/health
 * @desc Health check endpoint
 */
router.get('/', async (req: any, res: any) => {
  try {
    const health = await healthService.getHealthStatus()
    
    res.json({
      success: true,
      data: health,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('Health check error:', error)
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * @route GET /api/health/ready
 * @desc Readiness check endpoint
 */
router.get('/ready', async (req: any, res: any) => {
  try {
    const ready = await healthService.isReady()
    
    if (ready) {
      res.json({
        success: true,
        status: 'ready',
        timestamp: new Date().toISOString()
      })
    } else {
      res.status(503).json({
        success: false,
        status: 'not ready',
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    logger.error('Readiness check error:', error)
    res.status(503).json({
      success: false,
      status: 'not ready',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

/**
 * @route GET /api/health/live
 * @desc Liveness check endpoint
 */
router.get('/live', (req: any, res: any) => {
  res.json({
    success: true,
    status: 'alive',
    timestamp: new Date().toISOString()
  })
})

export { router as healthRoutes }
