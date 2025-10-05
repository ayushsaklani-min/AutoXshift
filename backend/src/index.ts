import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { swapRoutes } from './routes/swap'
import { aiRoutes } from './routes/ai'
import { healthRoutes } from './routes/health'
import { errorHandler } from './middleware/errorHandler'
import { logger } from './utils/logger'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// Body parsing and compression
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req: any, res: any, next: any) => {
  const ip = (req && (req.ip || (req.headers && (req.headers['x-forwarded-for'] as string)) || req.connection?.remoteAddress)) || 'unknown'
  logger.info(`${req.method} ${req.path} - ${ip}`)
  next()
})

// Routes
app.use('/api/health', healthRoutes)
app.use('/api/swap', swapRoutes)
app.use('/api/ai', aiRoutes)

// Root endpoint
app.get('/', (req: any, res: any) => {
  res.json({
    name: 'AutoXShift API',
    version: '1.0.0',
    description: 'AI-Powered Cross-Chain Payment Router Backend',
    status: 'running',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use('*', (req: any, res: any) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  })
})

// Error handling
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 AutoXShift API server running on port ${PORT}`)
  logger.info(`📊 Health check: http://localhost:${PORT}/api/health`)
  logger.info(`🔄 Swap API: http://localhost:${PORT}/api/swap`)
  logger.info(`🤖 AI API: http://localhost:${PORT}/api/ai`)
})

export default app
