'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { predictImage } from '@/lib/api'
import type { PredictionResult, ModelType } from '@/lib/api'
import ResultCard from './ResultCard'

type UploadState = 'idle' | 'dragging' | 'loading' | 'success' | 'error'

export default function ImageUploader() {
  const [state, setState] = useState<UploadState>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [modelType, setModelType] = useState<ModelType>('cnn')

  const inputRef = useRef<HTMLInputElement>(null)

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
      const prediction = await predictImage(file, modelType)
      setResult(prediction)
      setState('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setState('error')
    }
  }, [modelType])

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

      {/* 🔥 MODEL SELECTOR */}
      <div className="flex gap-2 mb-6 mt-6">
        {(['cnn', 'gan'] as ModelType[]).map((type) => (
          <button
            key={type}
            onClick={() => setModelType(type)}
            className={`
              flex-1 py-2 rounded-xl font-mono text-sm font-semibold
              border transition-all duration-200
              ${modelType === type
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-black border-gray-400 hover:bg-gray-200'
              }
            `}
          >
            {type === 'cnn' ? '🧠 CNN Model' : '⚔️ GAN Model'}
          </button>
        ))}
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
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => state === 'idle' && inputRef.current?.click()}
        className={`
          relative p-10 text-center cursor-pointer border rounded-xl transition-all duration-300
          ${state === 'dragging'
            ? 'border-blue-400 bg-blue-400/10 scale-[1.01]'
            : 'hover:border-gray-500'}
          ${state === 'loading' ? 'cursor-wait' : ''}
        `}
      >

        {/* Preview */}
        {preview && (
          <div className="mb-6 relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-xl object-contain"
            />
            {state === 'loading' && (
              <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                <Spinner />
              </div>
            )}
          </div>
        )}

        {/* Idle */}
        {state === 'idle' && !preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-white text-lg font-semibold mb-1">
              Drop image here
            </p>
            <p className="text-gray-400 text-sm">
              or click to browse — JPG, PNG, WebP
            </p>
          </motion.div>
        )}

        {/* Dragging */}
        {state === 'dragging' && (
          <p className="text-blue-400 text-lg font-bold">
            Release to upload
          </p>
        )}

        {/* Loading (no preview yet) */}
        {state === 'loading' && !preview && (
          <div className="flex flex-col items-center gap-3">
            <Spinner />
            <p className="text-gray-400 text-sm">
              Running {modelType.toUpperCase()} model...
            </p>
          </div>
        )}

        {fileName && state === 'loading' && (
          <p className="text-xs text-gray-400 mt-3 truncate">
            {fileName}
          </p>
        )}
      </div>

      {/* Error */}
      <AnimatePresence>
        {state === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
          >
            <p className="text-red-400 text-sm">{error}</p>
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={reset}
          className="mt-6 w-full py-3 text-gray-300 border border-gray-600 rounded-xl hover:border-gray-400 hover:text-white transition-all"
        >
          Try another image
        </motion.button>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <div className="w-8 h-8 border-2 border-blue-400/20 border-t-blue-400 rounded-full animate-spin" />
  )
}