'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Header } from '@/components/Header'
import { SwapPanel } from '@/components/SwapPanel'
import { AIRecommendation } from '@/components/AIRecommendation'
import { WalletOverview } from '@/components/WalletOverview'
import { SwapHistory } from '@/components/SwapHistory'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, Zap, BarChart3, History } from 'lucide-react'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [activeTab, setActiveTab] = useState('swap')

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold neon-text animate-fade-in">
              AutoXShift
            </h1>
            <p className="text-xl text-muted-foreground animate-fade-in">
              AI-Powered Cross-Chain Payment Router
            </p>
            <p className="text-lg text-muted-foreground animate-fade-in">
              Seamless token swaps on Polygon Mumbai with intelligent optimization
            </p>
          </div>
          
          <Card className="w-full max-w-md mx-auto glass-effect animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-6 w-6" />
                Connect Your Wallet
              </CardTitle>
              <CardDescription>
                Connect to Polygon Mumbai testnet to start swapping tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  className="w-full h-12 text-lg font-semibold neon-glow hover:neon-glow"
                  variant="outline"
                >
                  {connector.name}
                </Button>
              ))}
              <p className="text-sm text-muted-foreground text-center">
                Don't have Polygon Mumbai tokens? 
                <br />
                <a 
                  href="https://faucet.polygon.technology/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Get test tokens here
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 glass-effect">
                <TabsTrigger value="swap" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Swap
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  AI Analysis
                </TabsTrigger>
                <TabsTrigger value="wallet" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Wallet
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  History
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="swap" className="mt-6">
                <SwapPanel />
              </TabsContent>
              
              <TabsContent value="ai" className="mt-6">
                <AIRecommendation />
              </TabsContent>
              
              <TabsContent value="wallet" className="mt-6">
                <WalletOverview />
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                <SwapHistory />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <span className="text-primary font-semibold">Polygon Amoy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wallet</span>
                  <span className="text-sm font-mono">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-green-500 font-semibold">Connected</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">AI Features</CardTitle>
                <CardDescription>
                  Powered by advanced AI optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm">Smart Timing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm">Rate Optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  <span className="text-sm">Gas Efficiency</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  <span className="text-sm">AutoX Mode</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
