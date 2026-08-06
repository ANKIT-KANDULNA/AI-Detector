/*
  components/Navbar.tsx — Server Component, no "use client".
  Light mode, Google-style top navbar.
*/

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav
      className="relative z-20 flex items-center justify-between px-6 py-3"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: '0 1px 3px 0 rgba(60,64,67,0.06)',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 select-none"
        style={{ textDecoration: 'none' }}
      >
        {/* Google-style coloured icon */}
        <div className="flex gap-[3px] items-end">
          <span
            className="block rounded-sm"
            style={{ width: 6, height: 14, background: 'var(--color-accent)' }}
          />
          <span
            className="block rounded-sm"
            style={{ width: 6, height: 10, background: 'var(--color-fake)' }}
          />
          <span
            className="block rounded-sm"
            style={{ width: 6, height: 17, background: 'var(--color-real)' }}
          />
          <span
            className="block rounded-sm"
            style={{ width: 6, height: 7, background: '#f29900' }}
          />
        </div>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '1.1rem',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.01em',
          }}
        >
          AI Detector
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        <Link href="/image" className="nav-link">
          Detect Image
        </Link>
      </div>
    </nav>
  )
}