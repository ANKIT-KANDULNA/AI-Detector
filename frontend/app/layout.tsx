/*
  layout.tsx — THE most important file to understand in Next.js.

  Every page in your app is wrapped by this layout automatically.
  Think of it as the "frame" around every page — navbar, fonts, global CSS.

  This is a SERVER COMPONENT (no "use client" at top).
  It runs on the server — it never re-renders, it's just HTML shell.

  The { children } prop is whatever page.tsx is active for the current route.
*/

import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import GridBackground from '@/components/GridBackground'

// Metadata is a Next.js feature — sets <title> and <meta> tags automatically.
// This is way better than manually writing <Head> tags like in old Next.js.
export const metadata: Metadata = {
  title: 'AI Detector — AI Image & Video Detector',
  description: 'Detect AI-generated images and videos with deep learning.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen relative overflow-x-hidden">
        {/* 
          Decorative background grid — purely visual.
          Lives in layout so it's on every page without repeating code. 
        */}
        <GridBackground />

        {/* Navbar is on every page */}
        <Navbar />

        {/* 
          Main content area. 
          `children` will be replaced by whatever page you navigate to. 
        */}
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}
