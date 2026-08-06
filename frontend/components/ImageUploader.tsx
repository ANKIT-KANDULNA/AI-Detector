'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { predictImage, fetchAvailableModels } from '@/lib/api'
import type { PredictionResult, ModelType } from '@/lib/api'
import ResultCard from './ResultCard'

type UploadState = 'idle' | 'dragging' | 'loading' | 'success' | 'error'

export default function ImageUploader() {
  const [state, setState] = useState<UploadState>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [modelType, setModelType] = useState<ModelType>('ensemble')
  const [registryModels, setRegistryModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('best')
  const [threshold, setThreshold] = useState<number>(0.35)

  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch available models on mount
  useState(() => {
    fetchAvailableModels().then(setRegistryModels).catch(console.error)
  })

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WebP).')
      setState('error')
      return
    }

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    setState('loading')
    setError(null)
    setResult(null)

    try {
      const prediction = await predictImage(file, modelType, selectedModel, threshold)
      setResult(prediction)
      setState('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setState('error')
    }
  }, [modelType, selectedModel, threshold])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setState('dragging')
  }

  const handleDragLeave = () => {
    if (state === 'dragging') setState('idle')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const reset = () => {
    setState('idle')
    setPreview(null)
    setResult(null)
    setError(null)
    setFileName(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="max-w-xl mx-auto px-4">

      {/* MODEL SELECTOR */}
      <div className="flex gap-2 mb-6 mt-6">
        {(['cnn', 'gan', 'ensemble'] as ModelType[]).map((type) => (
          <button
            key={type}
            onClick={() => setModelType(type)}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              fontFamily: 'var(--font-body)',
              border: modelType === type
                ? '1.5px solid var(--color-accent)'
                : '1.5px solid var(--color-border-strong)',
              background: modelType === type
                ? 'var(--color-accent-bg)'
                : 'var(--color-surface)',
              color: modelType === type
                ? 'var(--color-accent)'
                : 'var(--color-text-secondary)',
              boxShadow: modelType === type ? '0 0 0 1px var(--color-accent-border)' : 'none',
            }}
          >
            {type === 'cnn' ? '🧠 CNN Model' : type === 'gan' ? '⚔️ GAN Model' : '🔥 Ensemble'}
          </button>
        ))}
      </div>

      {/* REGISTRY MODEL & SENSITIVITY SELECTORS */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>Model Selection</label>
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full py-2 px-3 rounded-xl text-sm transition-all outline-none"
            style={{ border: '1.5px solid var(--color-border-strong)', background: 'var(--color-surface)' }}
          >
            {registryModels.map(m => (
              <option key={m} value={m}>{m === 'best' ? 'Best Model (Primary)' : m}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>AI Sensitivity</label>
          <select 
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full py-2 px-3 rounded-xl text-sm transition-all outline-none"
            style={{ border: '1.5px solid var(--color-border-strong)', background: 'var(--color-surface)' }}
          >
            <option value={0.35}>Strict (Catch More AI)</option>
            <option value={0.50}>Balanced</option>
            <option value={0.65}>Lenient (Reduce False Positives)</option>
          </select>
        </div>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Upload Box */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => state === 'idle' && inputRef.current?.click()}
        animate={{
          borderColor: state === 'dragging' ? 'var(--color-accent)' : 'var(--color-border-strong)',
          scale: state === 'dragging' ? 1.01 : 1,
        }}
        transition={{ duration: 0.15 }}
        className="relative p-10 text-center rounded-2xl transition-colors"
        style={{
          cursor: state === 'idle' ? 'pointer' : state === 'loading' ? 'wait' : 'default',
          border: `2px dashed ${state === 'dragging' ? 'var(--color-accent)' : 'var(--color-border-strong)'}`,
          background: state === 'dragging'
            ? 'var(--color-accent-bg)'
            : 'var(--color-surface)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Preview image */}
        {preview && (
          <div className="mb-6 relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-xl object-contain"
              style={{ boxShadow: 'var(--shadow-md)' }}
            />
            {state === 'loading' && (
              <div
                className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-3"
                style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(4px)' }}
              >
                <Spinner />
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Running {modelType.toUpperCase()} model…
                </p>
              </div>
            )}
          </div>
        )}

        {/* Idle state */}
        {state === 'idle' && !preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
            {/* Upload icon */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--color-accent-bg)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11 16V7.85l-2.6 2.6L7 9l5-5 5 5-1.4 1.45-2.6-2.6V16h-2zm-5 4q-.825 0-1.413-.588A1.926 1.926 0 0 1 4 18v-3h2v3h12v-3h2v3q0 .825-.588 1.413A1.926 1.926 0 0 1 18 20H6z"
                  fill="var(--color-accent)"
                />
              </svg>
            </div>
            <p
              className="text-base font-semibold mb-1"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}
            >
              Drop an image here
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              or{' '}
              <span style={{ color: 'var(--color-accent)', fontWeight: 500 }}>browse your files</span>
              {' '}— JPG, PNG, WebP
            </p>
          </motion.div>
        )}

        {/* Dragging state */}
        {state === 'dragging' && (
          <motion.p
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-base font-semibold"
            style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}
          >
            Release to analyse ✦
          </motion.p>
        )}

        {/* Loading (no preview) */}
        {state === 'loading' && !preview && (
          <div className="flex flex-col items-center gap-3 py-4">
            <Spinner />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Running {modelType.toUpperCase()} model…
            </p>
          </div>
        )}

        {/* Filename */}
        {fileName && state === 'loading' && (
          <p
            className="text-xs mt-3 truncate"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}
          >
            {fileName}
          </p>
        )}
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {state === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 rounded-xl flex items-start gap-3"
            style={{
              background: 'var(--color-fake-bg)',
              border: '1px solid var(--color-fake-border)',
            }}
          >
            <span className="text-base">⚠️</span>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-fake)', fontFamily: 'var(--font-body)' }}>
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && <ResultCard result={result} />}
      </AnimatePresence>

      {/* Reset */}
      {(state === 'success' || state === 'error') && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={reset}
          className="btn-outline mt-5 w-full"
        >
          Try another image
        </motion.button>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <div
      className="w-8 h-8 rounded-full animate-spin"
      style={{ border: '2.5px solid var(--color-border)', borderTopColor: 'var(--color-accent)' }}
    />
  )
}