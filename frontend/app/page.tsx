// frontend/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { checkHealth } from '@/lib/api';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    checkHealth()
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">AI Image Detector</h1>
        
        {/* API Status */}
        <div className="mb-8">
          {apiStatus === 'online' && (
            <span className="text-green-600">✅ API Connected</span>
          )}
          {apiStatus === 'offline' && (
            <span className="text-red-600">❌ API Offline - Run python run.py</span>
          )}
        </div>

        {/* Navigation */}
        <div className="space-x-4">
          <Link
            href="/image"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Detect Image
          </Link>
        </div>
      </div>
    </div>
  );
}