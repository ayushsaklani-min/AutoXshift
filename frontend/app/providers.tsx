'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiConfig, createConfig } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { polygonMumbai } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { useState } from 'react'

// Configure Wagmi
const config = createConfig({
  connectors: [
    new InjectedConnector({ chains: [polygonMumbai] }),
    new MetaMaskConnector({ chains: [polygonMumbai] }),
    new WalletConnectConnector({
      chains: [polygonMumbai],
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
      },
    }),
  ],
  publicClient: createPublicClient({
    chain: polygonMumbai,
    transport: http(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY 
      ? `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
      : 'https://rpc-mumbai.maticvigil.com'
    ),
  }),
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  )
}
