import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AutoXShift - AI-Powered Cross-Chain Payment Router',
  description: 'Seamless token swaps on Polygon Amoy with AI optimization and automated trading strategies.',
  keywords: ['blockchain', 'defi', 'ai', 'polygon', 'sideshift', 'crypto', 'swap'],
  authors: [{ name: 'AutoXShift Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#00ff88',
  openGraph: {
    title: 'AutoXShift - AI-Powered Cross-Chain Payment Router',
    description: 'Seamless token swaps on Polygon Amoy with AI optimization and automated trading strategies.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoXShift - AI-Powered Cross-Chain Payment Router',
    description: 'Seamless token swaps on Polygon Amoy with AI optimization and automated trading strategies.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen gradient-bg">
            <div className="cyber-grid fixed inset-0 opacity-20" />
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
