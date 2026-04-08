/*
  components/Navbar.tsx

  This is a SERVER COMPONENT — no "use client".
  No state, no interactivity → doesn't need to run in the browser.
  Renders once on the server as pure HTML.

  Uses Next.js <Link> for navigation (prefetching + no page reload).
*/

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="relative z-20 flex items-center justify-between px-6 py-5 border-b border-border">

      {/* Logo */}
      <Link href="/" className="font-display text-xl font-bold text-gradient">
        AI Detector
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-6">
        <Link
          href="/image"
          className="font-mono text-sm text-muted hover:text-real transition-colors tracking-wider uppercase"
        >
          Image
        </Link>
        {/* <Link
          href="/video"
          className="font-mono text-sm text-muted hover:text-accent transition-colors tracking-wider uppercase"
        >
          Video
        </Link> */}
      </div>
    </nav>
  )
}
