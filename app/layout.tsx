'use client'

import { MetaMaskProvider } from 'metamask-react'
import './globals.css'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { LightNode } from '@waku/interfaces'
import { initWaku } from './utils/waku'
import { WakuProvider } from './hooks/useWakuContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [waku, setWaku] = useState<LightNode>();

  // Waku initialization
  useEffect(() => {
    (async () => {
      if (waku) return;

      const _waku = await initWaku();
      console.log("waku: ready");
      setWaku(_waku);
    })().catch((e) => {
      console.error("Failed to initiate Waku", e);
    });
  }, [waku]);

  return (
    <html lang="en">
      <body className={inter.className} style={{ backgroundColor: 'mediumpurple' }}>
        <WakuProvider>
          <MetaMaskProvider>
            {children}
          </MetaMaskProvider>
        </WakuProvider>
      </body>
    </html>
  )
}
