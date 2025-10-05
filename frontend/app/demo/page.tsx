'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Zap, 
  Brain,
  ArrowRight,
  Wallet,
  BarChart3,
  History,
  Settings
} from 'lucide-react'

interface DemoStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  action?: string
}

const demoSteps: DemoStep[] = [
  {
    id: 'connect',
    title: 'Connect Wallet',
    description: 'Connect your MetaMask wallet to Polygon Amoy testnet',
    icon: <Wallet className="h-6 w-6" />,
    completed: false,
    action: 'Connect Wallet'
  },
  {
    id: 'swap',
    title: 'Execute Swap',
    description: 'Swap 100 AUTOX tokens for SHIFT tokens using AI optimization',
    icon: <Zap className="h-6 w-6" />,
    completed: false,
    action: 'Go to Swap'
  },
  {
    id: 'ai',
    title: 'AI Analysis',
    description: 'View AI recommendations for optimal swap timing and rates',
    icon: <Brain className="h-6 w-6" />,
    completed: false,
    action: 'View AI Analysis'
  },
  {
    id: 'wallet',
    title: 'Wallet Overview',
    description: 'Check your token balances and portfolio performance',
    icon: <BarChart3 className="h-6 w-6" />,
    completed: false,
    action: 'View Wallet'
  },
  {
    id: 'history',
    title: 'Transaction History',
    description: 'Review your swap history and transaction details',
    icon: <History className="h-6 w-6" />,
    completed: false,
    action: 'View History'
  }
]

export default function DemoPage() {
  const { isConnected } = useAccount()
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState(demoSteps)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    // Update connect step based on wallet connection
    setSteps(prev => prev.map(step => 
      step.id === 'connect' 
        ? { ...step, completed: isConnected }
        : step
    ))
  }, [isConnected])

  const handleStepAction = (stepId: string) => {
    switch (stepId) {
      case 'connect':
        // Wallet connection is handled by the main app
        break
      case 'swap':
        window.location.href = '/#swap'
        break
      case 'ai':
        window.location.href = '/#ai'
        break
      case 'wallet':
        window.location.href = '/#wallet'
        break
      case 'history':
        window.location.href = '/#history'
        break
    }
  }

  const handleRunDemo = async () => {
    setIsRunning(true)
    
    // Simulate demo progression
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, completed: true } : step
      ))
      setCurrentStep(i + 1)
    }
    
    setIsRunning(false)
  }

  const completedSteps = steps.filter(step => step.completed).length
  const progress = (completedSteps / steps.length) * 100

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold neon-text">
              AutoXShift Demo
            </h1>
            <p className="text-xl text-muted-foreground">
              Experience the full power of AI-powered cross-chain swaps
            </p>
          </div>

          {/* Progress */}
          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Demo Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {completedSteps} of {steps.length} completed
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold">{Math.round(progress)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <Card 
                key={step.id} 
                className={`glass-effect transition-all duration-300 ${
                  step.completed ? 'ring-2 ring-green-500' : ''
                } ${index === currentStep ? 'ring-2 ring-primary' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        step.completed 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-primary/20 text-primary'
                      }`}>
                        {step.completed ? <CheckCircle className="h-6 w-6" /> : step.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {step.description}
                        </CardDescription>
                      </div>
                    </div>
                    {step.completed && (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {step.action && (
                    <Button
                      onClick={() => handleStepAction(step.id)}
                      disabled={step.id === 'connect' && !isConnected}
                      className="w-full"
                      variant={step.completed ? "outline" : "default"}
                    >
                      {step.completed ? 'Completed' : step.action}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Demo Controls */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-6 w-6" />
                Demo Controls
              </CardTitle>
              <CardDescription>
                Run the complete demo flow or step through manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={handleRunDemo}
                  disabled={isRunning}
                  className="flex-1 h-12 text-lg font-semibold neon-glow"
                >
                  {isRunning ? (
                    <>
                      <Clock className="h-5 w-5 mr-2 animate-spin" />
                      Running Demo...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Run Complete Demo
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="h-12"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Manual Mode
                </Button>
              </div>
              
              {isRunning && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.title}
                  </p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-200"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features Showcase */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Key Features Demonstrated</CardTitle>
              <CardDescription>
                What you'll experience in this demo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">🤖 AI-Powered Optimization</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Smart timing recommendations</li>
                    <li>• Rate optimization analysis</li>
                    <li>• Gas efficiency suggestions</li>
                    <li>• Risk assessment alerts</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">⚡ Seamless Swapping</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• One-click token swaps</li>
                    <li>• Real-time price quotes</li>
                    <li>• Slippage protection</li>
                    <li>• Transaction tracking</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">📊 Portfolio Management</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Real-time balance tracking</li>
                    <li>• Performance analytics</li>
                    <li>• Transaction history</li>
                    <li>• Export capabilities</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">🔒 Security & Control</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 100% self-custodial</li>
                    <li>• No data storage</li>
                    <li>• Smart contract security</li>
                    <li>• Transparent operations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Prerequisites and setup instructions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Get Test Tokens</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    You'll need Polygon Amoy testnet tokens to use the demo.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://faucet.polygon.technology/', '_blank')}
                  >
                    Get Test MATIC
                  </Button>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Connect Wallet</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Make sure your MetaMask is connected to Polygon Amoy testnet.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/'}
                  >
                    Connect Wallet
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
