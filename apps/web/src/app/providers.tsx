'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'

import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/react-query'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        <main>{children}</main>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
