'use client'

import { useState, useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Activity,
  RefreshCw,
  Copy,
  ExternalLink,
  Zap,
  BarChart3
} from 'lucide-react'
import { formatAddress, formatTokenAmount, formatUSD } from '@/lib/utils'

interface TokenBalance {
  symbol: string
  name: string
  balance: string
  usdValue: number
  change24h: number
  icon: string
  address: string
}

const mockTokenBalances: TokenBalance[] = [
  {
    symbol: 'AUTOX',
    name: 'AutoX Token',
    balance: '1000.0',
    usdValue: 500.0,
    change24h: 12.5,
    icon: '🚀',
    address: '0x...'
  },
  {
    symbol: 'SHIFT',
    name: 'Shift Token',
    balance: '1500.0',
    usdValue: 750.0,
    change24h: -3.2,
    icon: '⚡',
    address: '0x...'
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    balance: '50.0',
    usdValue: 25.0,
    change24h: 5.8,
    icon: '💎',
    address: '0x...'
  }
]

export function WalletOverview() {
  const { address } = useAccount()
  const [balances, setBalances] = useState<TokenBalance[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [totalValue, setTotalValue] = useState(0)

  useEffect(() => {
    // Simulate loading balances
    setBalances(mockTokenBalances)
    setTotalValue(mockTokenBalances.reduce((sum, token) => sum + token.usdValue, 0))
  }, [address])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500'
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Wallet className="h-8 w-8 text-primary" />
          Wallet Overview
        </h2>
        <p className="text-muted-foreground">
          Manage your tokens and track your portfolio performance
        </p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">{formatUSD(totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">+8.2% (24h)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Swaps</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-sm text-muted-foreground">AutoX Mode</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gas Saved</p>
                <p className="text-2xl font-bold">$12.50</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-sm text-green-500">This month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Address */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-mono text-sm">{formatAddress(address || '')}</p>
                <p className="text-xs text-muted-foreground">Polygon Amoy</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyAddress(address || '')}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://amoy.polygonscan.com/address/${address}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Token Balances */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Token Balances
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <CardDescription>
            Your current token holdings and their values
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {balances.map((token) => (
              <div key={token.symbol} className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{token.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{token.symbol}</h4>
                      <span className="text-sm text-muted-foreground">{token.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Balance: {formatTokenAmount(token.balance)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatUSD(token.usdValue)}</p>
                  <div className={`flex items-center gap-1 ${getChangeColor(token.change24h)}`}>
                    {getChangeIcon(token.change24h)}
                    <span className="text-sm">
                      {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common wallet operations and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Zap className="h-5 w-5" />
              <span className="text-sm">Swap Tokens</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Activity className="h-5 w-5" />
              <span className="text-sm">View History</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm">Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <RefreshCw className="h-5 w-5" />
              <span className="text-sm">Refresh</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
