interface LogLevel {
  ERROR: 0
  WARN: 1
  INFO: 2
  DEBUG: 3
}

const LOG_LEVELS: LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
}

class Logger {
  private level: number

  constructor() {
    this.level = LOG_LEVELS[process.env.LOG_LEVEL as keyof LogLevel] || LOG_LEVELS.INFO
  }

  private log(level: keyof LogLevel, message: string, ...args: any[]): void {
    if (LOG_LEVELS[level] <= this.level) {
      const timestamp = new Date().toISOString()
      const logMessage = `[${timestamp}] [${level}] ${message}`
      
      switch (level) {
        case 'ERROR':
          console.error(logMessage, ...args)
          break
        case 'WARN':
          console.warn(logMessage, ...args)
          break
        case 'INFO':
          console.info(logMessage, ...args)
          break
        case 'DEBUG':
          console.debug(logMessage, ...args)
          break
      }
    }
  }

  error(message: string, ...args: any[]): void {
    this.log('ERROR', message, ...args)
  }

  warn(message: string, ...args: any[]): void {
    this.log('WARN', message, ...args)
  }

  info(message: string, ...args: any[]): void {
    this.log('INFO', message, ...args)
  }

  debug(message: string, ...args: any[]): void {
    this.log('DEBUG', message, ...args)
  }
}

export const logger = new Logger()
