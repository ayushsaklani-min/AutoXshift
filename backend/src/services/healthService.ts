import { logger } from '../utils/logger'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: number
  uptime: number
  version: string
  services: {
    database: 'up' | 'down'
    sideshift: 'up' | 'down'
    openai: 'up' | 'down'
    polygon: 'up' | 'down'
  }
  metrics: {
    memoryUsage: number
    cpuUsage: number
    activeConnections: number
  }
}

class HealthService {
  private startTime: number

  constructor() {
    this.startTime = Date.now()
  }

  /**
   * Get overall health status
   */
  async getHealthStatus(): Promise<HealthStatus> {
    try {
      const services = await this.checkServices()
      const metrics = await this.getMetrics()
      
      const overallStatus = this.determineOverallStatus(services)
      
      return {
        status: overallStatus,
        timestamp: Date.now(),
        uptime: Date.now() - this.startTime,
        version: process.env.npm_package_version || '1.0.0',
        services,
        metrics
      }
    } catch (error) {
      logger.error('Error getting health status:', error)
      return {
        status: 'unhealthy',
        timestamp: Date.now(),
        uptime: Date.now() - this.startTime,
        version: process.env.npm_package_version || '1.0.0',
        services: {
          database: 'down',
          sideshift: 'down',
          openai: 'down',
          polygon: 'down'
        },
        metrics: {
          memoryUsage: 0,
          cpuUsage: 0,
          activeConnections: 0
        }
      }
    }
  }

  /**
   * Check if service is ready to accept requests
   */
  async isReady(): Promise<boolean> {
    try {
      const services = await this.checkServices()
      
      // Service is ready if critical services are up
      const criticalServices = ['sideshift', 'polygon']
      const criticalUp = criticalServices.every(service => services[service as keyof typeof services] === 'up')
      
      return criticalUp
    } catch (error) {
      logger.error('Error checking readiness:', error)
      return false
    }
  }

  /**
   * Check status of all services
   */
  private async checkServices(): Promise<HealthStatus['services']> {
    const [sideshift, googleAI, polygon] = await Promise.allSettled([
      this.checkSideShiftAPI(),
      this.checkGoogleAI(),
      this.checkPolygonRPC()
    ])

    return {
      database: 'up', // Mock - in real app, check actual DB
      sideshift: sideshift.status === 'fulfilled' && sideshift.value ? 'up' : 'down',
      openai: googleAI.status === 'fulfilled' && googleAI.value ? 'up' : 'down', // Keep same key for compatibility
      polygon: polygon.status === 'fulfilled' && polygon.value ? 'up' : 'down'
    }
  }

  /**
   * Get system metrics
   */
  private async getMetrics(): Promise<HealthStatus['metrics']> {
    const memUsage = process.memoryUsage()
    
    return {
      memoryUsage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
      cpuUsage: 0, // Mock - in real app, use actual CPU monitoring
      activeConnections: 0 // Mock - in real app, track actual connections
    }
  }

  /**
   * Check SideShift API status
   */
  private async checkSideShiftAPI(): Promise<boolean> {
    try {
      // In a real implementation, this would ping the actual SideShift API
      // For demo purposes, we'll simulate a check
      return true
    } catch (error) {
      logger.error('SideShift API check failed:', error)
      return false
    }
  }

  /**
   * Check Google AI API status
   */
  private async checkGoogleAI(): Promise<boolean> {
    try {
      // In a real implementation, this would ping the Google AI API
      // For demo purposes, we'll check if the API key is configured
      return !!process.env.GOOGLE_API_KEY
    } catch (error) {
      logger.error('Google AI API check failed:', error)
      return false
    }
  }

  /**
   * Check Polygon RPC status
   */
  private async checkPolygonRPC(): Promise<boolean> {
    try {
      // In a real implementation, this would ping the Polygon RPC
      // For demo purposes, we'll simulate a check
      return true
    } catch (error) {
      logger.error('Polygon RPC check failed:', error)
      return false
    }
  }

  /**
   * Determine overall health status based on service status
   */
  private determineOverallStatus(services: HealthStatus['services']): 'healthy' | 'degraded' | 'unhealthy' {
    const serviceStatuses = Object.values(services)
    const upCount = serviceStatuses.filter(status => status === 'up').length
    const totalCount = serviceStatuses.length

    if (upCount === totalCount) {
      return 'healthy'
    } else if (upCount >= totalCount * 0.5) {
      return 'degraded'
    } else {
      return 'unhealthy'
    }
  }
}

export const healthService = new HealthService()
