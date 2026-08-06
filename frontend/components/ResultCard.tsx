'use client'

import { motion } from 'framer-motion'
import type { PredictionResult } from '@/lib/api'

interface ResultCardProps {
  result: PredictionResult
}

export default function ResultCard({ result }: ResultCardProps) {
  const isReal = result.prediction === 'REAL'
  const confidence = result.confidence

  const colorHex    = isReal ? 'var(--color-real)'    : 'var(--color-fake)'
  const bgColor     = isReal ? 'var(--color-real-bg)' : 'var(--color-fake-bg)'
  const borderColor = isReal ? 'var(--color-real-border)' : 'var(--color-fake-border)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="mt-6 overflow-hidden"
      style={{
        background: 'var(--color-surface)',
        border: `1px solid ${borderColor}`,
        borderRadius: 16,
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Coloured top strip */}
      <div style={{ height: 4, background: colorHex, borderRadius: '16px 16px 0 0' }} />

      <div className="p-8">
        {/* Badge */}
        <div
          className="label-badge mb-5"
          style={{ background: bgColor, color: colorHex, border: `1px solid ${borderColor}` }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse-slow"
            style={{ background: colorHex, display: 'inline-block' }}
          />
          {isReal ? 'Real Content' : 'AI Generated'}
        </div>

        {/* Big verdict */}
        <h2
          className="mb-1"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '3rem',
            fontWeight: 700,
            color: colorHex,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {result.prediction}
        </h2>
        <p
          className="mb-6"
          style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}
        >
          {isReal ? 'This image appears to be authentic.' : 'This image appears to be AI-generated.'}
        </p>

        {/* Confidence bar */}
        <div style={{ marginBottom: '1rem' }}>
          <div
            className="flex justify-between items-center mb-2"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
          >
            <span style={{ color: 'var(--color-text-secondary)' }}>Confidence</span>
            <span style={{ color: colorHex, fontWeight: 600 }}>{confidence.toFixed(1)}%</span>
          </div>

          {/* Track */}
          <div
            className="overflow-hidden"
            style={{ height: 8, borderRadius: 99, background: 'var(--color-surface-2)' }}
          >
            <motion.div
              style={{ height: '100%', borderRadius: 99, background: colorHex }}
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ delay: 0.25, duration: 0.9, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Detail chips if ensemble */}
        {result.details && Object.keys(result.details).length > 1 && (
          <div className="flex gap-2 mt-4">
            {Object.entries(result.details).map(([model, data]: [string, { score: number; label: string }]) => (
              <div
                key={model}
                className="flex-1 p-3 rounded-xl text-center"
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--color-text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 4,
                  }}
                >
                  {model.toUpperCase()}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: data.label === 'REAL' ? 'var(--color-real)' : 'var(--color-fake)',
                  }}
                >
                  {data.label}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--color-text-tertiary)',
                    marginTop: 2,
                  }}
                >
                  {(data.score * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Interpretation note */}
        <p
          className="mt-5 text-sm"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-tertiary)',
            borderTop: '1px solid var(--color-border)',
            paddingTop: '1rem',
          }}
        >
          {confidence < 60
            ? '⚠️ Low confidence — the model is uncertain. Try a higher quality image.'
            : confidence < 80
            ? '🔍 Moderate confidence — likely correct but not definitive.'
            : '✓ High confidence prediction.'}
        </p>
      </div>
    </motion.div>
  )
}
