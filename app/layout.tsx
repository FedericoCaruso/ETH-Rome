'use client'

import { MetaMaskProvider } from 'metamask-react'
import './globals.css'
import { Inter } from 'next/font/google'
import { LightNodeProvider } from '@waku/react'
import { Protocols } from "@waku/interfaces";

// import { WakuProvider } from './hooks/useWakuContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body className={inter.className}>
        <LightNodeProvider
          options={{ defaultBootstrap: true }}
          protocols={[Protocols.Filter, Protocols.LightPush, Protocols.Store]}>
          <MetaMaskProvider>
            {children}
          </MetaMaskProvider>
        </LightNodeProvider>

      </body>
    </html>
  )
}
