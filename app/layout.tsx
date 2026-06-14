import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FitSpace — Running Tracker',
  description: 'Track your runs, measure your progress',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  )
}
