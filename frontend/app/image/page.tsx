'use client'

import ImageUploader from '@/components/ImageUploader'

export default function ImagePage() {
  return (
    <div className="flex justify-center items-start min-h-screen pt-20 bg-gray-900">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          AI Image Detector
        </h1>

        <ImageUploader />
      </div>
    </div>
  )
}