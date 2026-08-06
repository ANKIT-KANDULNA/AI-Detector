// frontend/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { checkHealth } from '@/lib/api';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    checkHealth()
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  return (
    <div className="min-h-[calc(100vh-57px)] px-4 py-16 flex flex-col items-center">
      <div className="text-center max-w-2xl mx-auto flex-1 flex flex-col justify-center mb-24">

        {/* Hero badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-sm font-medium"
          style={{
            background: 'var(--color-accent-bg)',
            border: '1px solid var(--color-accent-border)',
            color: 'var(--color-accent)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: 'var(--color-accent)', display: 'inline-block' }}
          />
          Powered by CNN + GAN Ensemble
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--color-text-primary)',
          }}
        >
          Is this image{' '}
          <span style={{ color: 'var(--color-real)' }}>real</span>
          {' '}or{' '}
          <span style={{ color: 'var(--color-fake)' }}>AI?</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mb-10"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            maxWidth: 480,
            margin: '0 auto 2.5rem',
          }}
        >
          Upload any image and our deep learning models will instantly detect
          whether it's genuine or AI-generated.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
        >
          <Link href="/image" className="btn-primary text-base px-8 py-3">
            Analyse an Image
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="m14 18-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45 14 6l6 6-6 6z"/>
            </svg>
          </Link>
        </motion.div>

        {/* API status pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{
            fontFamily: 'var(--font-mono)',
            background: apiStatus === 'online'
              ? 'var(--color-real-bg)'
              : apiStatus === 'offline'
              ? 'var(--color-fake-bg)'
              : 'var(--color-surface-2)',
            border: `1px solid ${
              apiStatus === 'online'
                ? 'var(--color-real-border)'
                : apiStatus === 'offline'
                ? 'var(--color-fake-border)'
                : 'var(--color-border)'
            }`,
            color: apiStatus === 'online'
              ? 'var(--color-real)'
              : apiStatus === 'offline'
              ? 'var(--color-fake)'
              : 'var(--color-text-secondary)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              display: 'inline-block',
              background: apiStatus === 'online'
                ? 'var(--color-real)'
                : apiStatus === 'offline'
                ? 'var(--color-fake)'
                : 'var(--color-text-tertiary)',
            }}
          />
          {apiStatus === 'checking'
            ? 'Connecting to API…'
            : apiStatus === 'online'
            ? 'API Connected'
            : 'API Offline — start the backend'}
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mt-10"
        >
          {['CNN Detection', 'GAN Discriminator', 'Ensemble Mode', 'Instant Results'].map((feat) => (
            <span
              key={feat}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                fontFamily: 'var(--font-body)',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {feat}
            </span>
          ))}
        </motion.div>
        </motion.div>
      </div>

      {/* Coming Soon Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="max-w-4xl w-full mx-auto pb-16"
      >
        <div className="text-center mb-8">
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            Coming Soon to the Platform
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
            We're expanding our detection capabilities to handle more media types.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: '🎥 AI Video Detector', desc: 'Frame-by-frame analysis to detect deepfakes and AI-generated video content.' },
            { title: '📝 AI Text Detector', desc: 'Identify text generated by LLMs like ChatGPT, Claude, and Gemini.' },
            { title: '🎵 AI Audio Detector', desc: 'Analyze voice patterns and audio frequencies to spot AI voice clones.' }
          ].map((item, i) => (
            <div 
              key={i}
              className="p-6 rounded-2xl text-left"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                {item.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
                {item.desc}
              </p>
              <div className="mt-4 inline-block px-2 py-1 rounded text-xs font-medium" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-tertiary)' }}>
                In Development
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}