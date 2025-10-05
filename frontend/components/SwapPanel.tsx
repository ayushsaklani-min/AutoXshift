'use client'

import { useState, useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowUpDown, 
  Zap, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { formatTokenAmount, formatUSD } from '@/lib/utils'

// Mock token data - in real app, this would come from contracts
const TOKENS = [
  {
    symbol: 'AUTOX',
    name: 'AutoX Token',
    address: process.env.NEXT_PUBLIC_AUTOX_TOKEN_ADDRESS || '0x...',
    decimals: 18,
    icon: '🚀'
  },
  {
    symbol: 'SHIFT',
    name: 'Shift Token', 
    address: process.env.NEXT_PUBLIC_SHIFT_TOKEN_ADDRESS || '0x...',
    decimals: 18,
    icon: '⚡'
  }
]

export function SwapPanel() {
  const { address } = useAccount()
  const [fromToken, setFromToken] = useState(TOKENS[0])
  const [toToken, setToToken] = useState(TOKENS[1])
  const [amount, setAmount] = useState('')
  const [slippage, setSlippage] = useState(0.5)
  const [isAutoXMode, setIsAutoXMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [swapQuote, setSwapQuote] = useState<any>(null)
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')

  // Mock balance - in real app, use useBalance hook
  const mockBalance = 1000
  const mockPrice = 0.5 // Mock USD price

  // Mock contract write functionality for now
  const mockWrite = () => {
    console.log("Mock contract write")
    setTxStatus("pending")
    setTimeout(() => setTxStatus("success"), 2000)
  }
  const hash = null
  const error = null
  const isConfirming = false
  const isSuccess = txStatus === "success"

  // Calculate swap quote
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const inputAmount = parseFloat(amount)
      const outputAmount = inputAmount * 1.5 // Mock 1.5x rate
      const fee = inputAmount * 0.003 // 0.3% fee
      const minOutput = outputAmount * (1 - slippage / 100)
      
      setSwapQuote({
        inputAmount,
        outputAmount,
        fee,
        minOutput,
        rate: outputAmount / inputAmount,
        priceImpact: 0.1
      })
    } else {
      setSwapQuote(null)
    }
  }, [amount, slippage])

  const handleSwap = async () => {
    if (!address || !swapQuote) return

    setIsLoading(true)
    setTxStatus('pending')

    try {
      // Mock swap - in real app, call the swap contract
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setTxStatus('success')
      setAmount('')
      setSwapQuote(null)
    } catch (err) {
      setTxStatus('error')
      console.error('Swap failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTokenSwitch = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setAmount('')
    setSwapQuote(null)
  }

  const handleMaxAmount = () => {
    setAmount(mockBalance.toString())
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Token Swap</h2>
        <p className="text-muted-foreground">
          Swap tokens with AI-optimized routing and timing
        </p>
      </div>

      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Swap Tokens
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">AutoX Mode</span>
              <Button
                variant={isAutoXMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAutoXMode(!isAutoXMode)}
                className={isAutoXMode ? "neon-glow" : ""}
              >
                {isAutoXMode ? "ON" : "OFF"}
              </Button>
            </div>
          </div>
          <CardDescription>
            {isAutoXMode 
              ? "AI will automatically execute swaps at optimal times"
              : "Manual swap execution with AI recommendations"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* From Token */}
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <div className="flex items-center space-x-3 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center space-x-3 flex-1">
                <div className="text-2xl">{fromToken.icon}</div>
                <div>
                  <p className="font-semibold">{fromToken.symbol}</p>
                  <p className="text-sm text-muted-foreground">{fromToken.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Balance: {formatTokenAmount(mockBalance)}
                </p>
                <p className="text-xs text-muted-foreground">
                  ≈ {formatUSD(mockBalance * mockPrice)}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" onClick={handleMaxAmount}>
                MAX
              </Button>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleTokenSwitch}
              className="h-12 w-12 rounded-full hover:bg-primary/10"
            >
              <ArrowUpDown className="h-5 w-5" />
            </Button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <div className="flex items-center space-x-3 p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center space-x-3 flex-1">
                <div className="text-2xl">{toToken.icon}</div>
                <div>
                  <p className="font-semibold">{toToken.symbol}</p>
                  <p className="text-sm text-muted-foreground">{toToken.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {swapQuote ? formatTokenAmount(swapQuote.outputAmount) : '0.0'}
                </p>
                <p className="text-xs text-muted-foreground">
                  ≈ {swapQuote ? formatUSD(swapQuote.outputAmount * mockPrice) : '$0.00'}
                </p>
              </div>
            </div>
          </div>

          {/* Swap Quote */}
          {swapQuote && (
            <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
              <h4 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Swap Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate</span>
                  <span>1 {fromToken.symbol} = {swapQuote.rate.toFixed(4)} {toToken.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee</span>
                  <span>{formatTokenAmount(swapQuote.fee)} {fromToken.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price Impact</span>
                  <span className="text-green-500">{swapQuote.priceImpact}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Minimum Received</span>
                  <span>{formatTokenAmount(swapQuote.minOutput)} {toToken.symbol}</span>
                </div>
              </div>
            </div>
          )}

          {/* Slippage Settings */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Slippage Tolerance</label>
            <div className="flex space-x-2">
              {[0.1, 0.5, 1.0].map((value) => (
                <Button
                  key={value}
                  variant={slippage === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSlippage(value)}
                >
                  {value}%
                </Button>
              ))}
              <Input
                type="number"
                placeholder="Custom"
                value={slippage}
                onChange={(e) => setSlippage(parseFloat(e.target.value) || 0)}
                className="w-20"
                step="0.1"
                min="0"
                max="50"
              />
            </div>
          </div>

          {/* Execute Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={!amount || !swapQuote || isLoading || isConfirming}
            className="w-full h-12 text-lg font-semibold neon-glow"
          >
            {isLoading || isConfirming ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                {isConfirming ? 'Confirming...' : 'Processing...'}
              </>
            ) : txStatus === 'success' ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Swap Successful!
              </>
            ) : txStatus === 'error' ? (
              <>
                <AlertCircle className="h-5 w-5 mr-2" />
                Swap Failed
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                {isAutoXMode ? 'Enable AutoX Mode' : 'Swap Tokens'}
              </>
            )}
          </Button>

          {/* Transaction Status */}
          {txStatus === 'success' && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-500 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Transaction confirmed! View on PolygonScan
              </p>
            </div>
          )}

          {txStatus === 'error' && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Transaction failed. Please try again.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
