'use client'
/*
  components/ResultCard.tsx

  "use client" — this component uses animations that run in the browser.
  
  Framer Motion (the animation library) needs to run client-side.
  Anything using `motion.div` must be a Client Component.
*/

import { motion } from 'framer-motion'
import type { PredictionResult } from '@/lib/api'

interface ResultCardProps {
  result: PredictionResult
}

export default function ResultCard({ result }: ResultCardProps) {
  const isReal = result.prediction === 'REAL'
  const confidence = result.confidence

  // Color scheme based on prediction
  const color = isReal ? 'real' : 'fake'
  const colorHex = isReal ? '#00e676' : '#ff1744'

  return (
    /*
      motion.div — Framer Motion's animated div.
      `initial`: starting state (hidden, shifted down)
      `animate`: final state (visible, in place)
      `transition`: how to get there (spring physics)
      
      This creates that satisfying "pop in" effect.
    */
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="card p-8 mt-8 relative overflow-hidden"
    >
      {/* Glow behind card based on result */}
      <div
        className="absolute inset-0 opacity-10 blur-2xl"
        style={{ background: `radial-gradient(circle at 30% 50%, ${colorHex}, transparent)` }}
      />

      <div className="relative z-10">
        {/* Result label */}
        <div className={`label-badge mb-4 ${
          isReal
            ? 'bg-real/10 text-real border border-real/30'
            : 'bg-fake/10 text-fake border border-fake/30'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isReal ? 'bg-real' : 'bg-fake'} animate-pulse`} />
          {isReal ? 'Real Content' : 'AI Generated'}
        </div>

        {/* Big label */}
        <h2 className="font-display text-5xl font-extrabold mb-6" style={{ color: colorHex }}>
          {result.prediction}
        </h2>

        {/* Confidence bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center font-mono text-sm">
            <span className="text-muted">Confidence</span>
            <span className="text-white font-medium">{confidence.toFixed(1)}%</span>
          </div>

          {/* Bar track */}
          <div className="h-2 bg-border rounded-full overflow-hidden">
            {/* 
              Animated fill — motion.div animates the width from 0 to the actual confidence.
              `transition.delay: 0.2` waits for the card to appear before the bar animates.
            */}
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: colorHex }}
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Interpretation note */}
        <p className="font-body text-muted text-sm mt-6">
          {confidence < 60
            ? '⚠️ Low confidence — model is uncertain. Try a higher quality image.'
            : confidence < 80
            ? 'Moderate confidence — likely correct but not definitive.'
            : '✓ High confidence prediction.'}
        </p>
      </div>
    </motion.div>
  )
}
