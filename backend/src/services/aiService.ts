import { GoogleGenerativeAI } from '@google/generative-ai'
import { logger } from '../utils/logger'

interface SwapRecommendation {
  id: string
  type: 'timing' | 'rate' | 'gas' | 'risk'
  title: string
  description: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
  action?: string
  timestamp: number
}

interface MarketAnalysis {
  overallSentiment: 'bullish' | 'bearish' | 'neutral'
  volatility: 'low' | 'medium' | 'high'
  recommendations: SwapRecommendation[]
  insights: string[]
  optimalTiming: {
    bestTime: string
    confidence: number
    reason: string
  }
}

interface GasOptimization {
  currentGasPrice: string
  recommendedGasPrice: string
  savings: string
  estimatedConfirmationTime: string
  recommendations: string[]
}

class AIService {
  private genAI: GoogleGenerativeAI | null = null
  private model: any = null

  constructor() {
    if (process.env.GOOGLE_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    } else {
      logger.warn('Google API key not found. AI features will use mock data.')
    }
  }

  /**
   * Get AI recommendations for swap timing and optimization
   */
  async getSwapRecommendations(params: {
    fromToken: string
    toToken: string
    amount: number
  }): Promise<SwapRecommendation[]> {
    try {
      if (this.model) {
        return await this.getAIRecommendations(params)
      } else {
        return this.getMockRecommendations(params)
      }
    } catch (error) {
      logger.error('Error getting AI recommendations:', error)
      return this.getMockRecommendations(params)
    }
  }

  /**
   * Analyze market conditions using AI
   */
  async analyzeMarketConditions(tokens: string[], timeframe: string): Promise<MarketAnalysis> {
    try {
      if (this.model) {
        return await this.getAIMarketAnalysis(tokens, timeframe)
      } else {
        return this.getMockMarketAnalysis(tokens, timeframe)
      }
    } catch (error) {
      logger.error('Error analyzing market conditions:', error)
      return this.getMockMarketAnalysis(tokens, timeframe)
    }
  }

  /**
   * Get AI explanation of swap transaction
   */
  async explainSwap(transaction: any): Promise<string> {
    try {
      if (this.model) {
        return await this.getAIExplanation(transaction)
      } else {
        return this.getMockExplanation(transaction)
      }
    } catch (error) {
      logger.error('Error explaining swap:', error)
      return this.getMockExplanation(transaction)
    }
  }

  /**
   * Get gas optimization recommendations
   */
  async getGasOptimization(network: string): Promise<GasOptimization> {
    try {
      // In a real implementation, this would analyze current gas prices
      // and provide optimization recommendations
      return {
        currentGasPrice: '30',
        recommendedGasPrice: '25',
        savings: '16.7%',
        estimatedConfirmationTime: '2-3 minutes',
        recommendations: [
          'Gas prices are currently 16% below average',
          'Consider executing within the next 15 minutes',
          'Use EIP-1559 transactions for better gas estimation'
        ]
      }
    } catch (error) {
      logger.error('Error getting gas optimization:', error)
      throw new Error('Failed to get gas optimization')
    }
  }

  /**
   * Configure AutoX mode settings
   */
  async configureAutoXMode(userAddress: string, settings: any): Promise<any> {
    try {
      // In a real implementation, this would save user preferences
      // and configure automated swap triggers
      logger.info(`AutoX mode configured for user ${userAddress}`)
      
      return {
        enabled: true,
        settings,
        triggers: [
          'Rate improvement > 5%',
          'Gas price < 20 gwei',
          'Market volatility < 2%'
        ],
        nextCheck: Date.now() + 300000 // 5 minutes
      }
    } catch (error) {
      logger.error('Error configuring AutoX mode:', error)
      throw new Error('Failed to configure AutoX mode')
    }
  }

  /**
   * Get AI-powered recommendations using Gemini
   */
  private async getAIRecommendations(params: {
    fromToken: string
    toToken: string
    amount: number
  }): Promise<SwapRecommendation[]> {
    if (!this.model) throw new Error('Gemini model not initialized')

    const prompt = `Analyze the following token swap and provide recommendations:
    - From: ${params.fromToken}
    - To: ${params.toToken}
    - Amount: ${params.amount}
    
    Provide 3-5 recommendations for optimal swap timing, rate optimization, gas efficiency, and risk management.
    Return as JSON array with type, title, description, confidence (0-100), impact (high/medium/low), and action.`

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      if (!text) throw new Error('No response from Gemini')

      const recommendations = JSON.parse(text)
      return recommendations.map((rec: any, index: number) => ({
        id: `gemini-${index}`,
        type: rec.type || 'timing',
        title: rec.title || 'AI Recommendation',
        description: rec.description || '',
        confidence: rec.confidence || 75,
        impact: rec.impact || 'medium',
        action: rec.action,
        timestamp: Date.now()
      }))
    } catch (parseError) {
      logger.error('Error parsing Gemini response:', parseError)
      return this.getMockRecommendations(params)
    }
  }

  /**
   * Get AI-powered market analysis
   */
  private async getAIMarketAnalysis(tokens: string[], timeframe: string): Promise<MarketAnalysis> {
    if (!this.model) throw new Error('Gemini model not initialized')

    const prompt = `Analyze the market conditions for these tokens: ${tokens.join(', ')} over ${timeframe}.
    Provide sentiment analysis, volatility assessment, and trading recommendations.
    Return as JSON with overallSentiment, volatility, recommendations array, insights array, and optimalTiming object.`

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      if (!text) throw new Error('No response from Gemini')

      return JSON.parse(text)
    } catch (parseError) {
      logger.error('Error parsing Gemini market analysis:', parseError)
      return this.getMockMarketAnalysis(tokens, timeframe)
    }
  }

  /**
   * Get AI explanation of swap transaction
   */
  private async getAIExplanation(transaction: any): Promise<string> {
    if (!this.model) throw new Error('Gemini model not initialized')

    const prompt = `Explain this swap transaction in simple terms for a non-technical user:
    ${JSON.stringify(transaction, null, 2)}
    
    Focus on what the transaction does, why it might be beneficial, and any risks involved.`

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return text || 'Unable to generate explanation'
    } catch (error) {
      logger.error('Error generating AI explanation:', error)
      return 'Unable to generate explanation'
    }
  }

  /**
   * Get mock recommendations for demo purposes
   */
  private getMockRecommendations(params: {
    fromToken: string
    toToken: string
    amount: number
  }): SwapRecommendation[] {
    return [
      {
        id: '1',
        type: 'timing',
        title: 'Optimal Swap Time Detected',
        description: `Market conditions suggest the next 15 minutes will have 23% better rates for ${params.fromToken}/${params.toToken} swaps.`,
        confidence: 87,
        impact: 'high',
        action: 'Execute swap now',
        timestamp: Date.now() - 300000
      },
      {
        id: '2',
        type: 'rate',
        title: 'Rate Optimization Available',
        description: `Alternative routing through 3 hops could save 0.8% on your ${params.amount} ${params.fromToken} swap with minimal additional risk.`,
        confidence: 92,
        impact: 'medium',
        action: 'Use optimized route',
        timestamp: Date.now() - 600000
      },
      {
        id: '3',
        type: 'gas',
        title: 'Gas Price Recommendation',
        description: 'Current gas prices are 15% below average. Good time for transactions.',
        confidence: 78,
        impact: 'low',
        action: 'Proceed with current gas',
        timestamp: Date.now() - 900000
      }
    ]
  }

  /**
   * Get mock market analysis for demo purposes
   */
  private getMockMarketAnalysis(tokens: string[], timeframe: string): MarketAnalysis {
    return {
      overallSentiment: 'bullish',
      volatility: 'medium',
      recommendations: this.getMockRecommendations({
        fromToken: tokens[0] || 'AUTOX',
        toToken: tokens[1] || 'SHIFT',
        amount: 100
      }),
      insights: [
        'Trading volume increased 15% in the last 24 hours',
        'Price momentum suggests continued upward movement',
        'Liquidity depth is healthy for large swaps'
      ],
      optimalTiming: {
        bestTime: 'Next 2-4 hours',
        confidence: 85,
        reason: 'Market volatility is low and liquidity is high'
      }
    }
  }

  /**
   * Get mock explanation for demo purposes
   */
  private getMockExplanation(transaction: any): string {
    return `Your ${transaction.fromToken} to ${transaction.toToken} swap will execute at a ${transaction.rate || 1.5}x exchange rate. The ${transaction.fee || 0.3}% fee covers network costs and liquidity provider rewards. With current gas prices, your transaction should confirm within 2-3 minutes. The ${transaction.slippage || 0.5}% slippage tolerance protects against small price movements during execution.`
  }
}

export const aiService = new AIService()
