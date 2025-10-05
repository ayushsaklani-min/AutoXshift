import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { createError } from './errorHandler'

// Validation schemas
const swapRequestSchema = Joi.object({
  fromToken: Joi.string().required().min(1).max(50),
  toToken: Joi.string().required().min(1).max(50),
  amount: Joi.number().required().positive(),
  userAddress: Joi.string().required().pattern(/^0x[a-fA-F0-9]{40}$/),
  slippage: Joi.number().optional().min(0).max(50)
})

const aiAnalysisSchema = Joi.object({
  tokens: Joi.array().items(Joi.string()).required().min(1),
  timeframe: Joi.string().optional().valid('1h', '24h', '7d', '30d').default('24h')
})

const autoXConfigSchema = Joi.object({
  enabled: Joi.boolean().required(),
  targetRate: Joi.number().optional().positive(),
  maxSlippage: Joi.number().optional().min(0).max(50),
  gasThreshold: Joi.number().optional().positive(),
  checkInterval: Joi.number().optional().min(60000).max(3600000) // 1 min to 1 hour
})

/**
 * Validate swap request
 */
export const validateSwapRequest = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = swapRequestSchema.validate(req.body)
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ')
    throw createError(`Validation Error: ${errorMessage}`, 400)
  }
  
  next()
}

/**
 * Validate AI analysis request
 */
export const validateAIAnalysis = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = aiAnalysisSchema.validate(req.body)
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ')
    throw createError(`Validation Error: ${errorMessage}`, 400)
  }
  
  next()
}

/**
 * Validate AutoX configuration
 */
export const validateAutoXConfig = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = autoXConfigSchema.validate(req.body)
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ')
    throw createError(`Validation Error: ${errorMessage}`, 400)
  }
  
  next()
}

/**
 * Validate Ethereum address
 */
export const validateAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Validate transaction hash
 */
export const validateTxHash = (txHash: string): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(txHash)
}

/**
 * Validate token amount
 */
export const validateAmount = (amount: number): boolean => {
  return amount > 0 && amount < Number.MAX_SAFE_INTEGER
}

/**
 * Validate slippage percentage
 */
export const validateSlippage = (slippage: number): boolean => {
  return slippage >= 0 && slippage <= 50
}
