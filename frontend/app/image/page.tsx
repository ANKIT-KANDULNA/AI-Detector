// // frontend/app/image/page.tsx
// 'use client';

// import { useState } from 'react';
// import { predictImage, PredictionResult } from '@/lib/api';

// export default function ImagePage() {
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [result, setResult] = useState<PredictionResult | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedImage(file);
//       setPreview(URL.createObjectURL(file));
//       setResult(null);
//     }
//   };

//   const handleDetect = async () => {
//     if (!selectedImage) return;

//     setLoading(true);
//     try {
//       const prediction = await predictImage(selectedImage);
//       setResult(prediction);
//     } catch (error) {
//       console.error('Detection failed:', error);
//       alert('Failed to detect image. Make sure the API is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 p-8">
//       <div className="max-w-2xl mx-auto">
//         <h1 className="text-4xl font-bold text-white mb-8 text-center">AI Image Detector</h1>
        
//         {/* Upload Area */}
//         <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-8 mb-8 text-center hover:border-blue-500 transition-colors">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageSelect}
//             className="hidden"
//             id="image-upload"
//           />
//           <label
//             htmlFor="image-upload"
//             className="cursor-pointer inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
//           >
//             📸 Select Image
//           </label>
          
//           {preview && (
//             <div className="mt-6">
//               <img src={preview} alt="Preview" className="max-w-full h-auto rounded-lg shadow-lg" />
//             </div>
//           )}
//         </div>

//         {/* Detect Button */}
//         {selectedImage && (
//           <button
//             onClick={handleDetect}
//             disabled={loading}
//             className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
//           >
//             {loading ? '🔍 Analyzing...' : '🎯 Detect Image'}
//           </button>
//         )}

//         {/* Results - FIXED VISIBILITY */}
//         {result && (
//           <div className={`mt-8 rounded-lg overflow-hidden shadow-xl ${
//             result.prediction === 'REAL' 
//               ? 'bg-green-900 border-l-8 border-green-400' 
//               : 'bg-red-900 border-l-8 border-red-400'
//           }`}>
//             {/* Header */}
//             <div className="p-6">
//               <h2 className={`text-3xl font-bold mb-4 ${
//                 result.prediction === 'REAL' ? 'text-green-400' : 'text-red-400'
//               }`}>
//                 {result.prediction === 'REAL' ? '✅ REAL Image' : '⚠️ FAKE Image'}
//               </h2>
              
//               {/* Confidence Circle */}
//               <div className="flex justify-center mb-6">
//                 <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
//                   result.prediction === 'REAL' ? 'bg-green-800' : 'bg-red-800'
//                 }`}>
//                   <div className="text-center">
//                     <div className={`text-3xl font-bold ${
//                       result.prediction === 'REAL' ? 'text-green-400' : 'text-red-400'
//                     }`}>
//                       {result.confidence}%
//                     </div>
//                     <div className="text-xs text-gray-300">Confidence</div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Stats Cards */}
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div className="bg-gray-800 rounded-lg p-4 text-center">
//                   <div className="text-2xl mb-1">🤖</div>
//                   <div className="text-sm text-gray-400">AI Generated</div>
//                   <div className={`text-2xl font-bold ${
//                     result.probability_fake > 50 ? 'text-red-400' : 'text-gray-300'
//                   }`}>
//                     {result.probability_fake}%
//                   </div>
//                 </div>
                
//                 <div className="bg-gray-800 rounded-lg p-4 text-center">
//                   <div className="text-2xl mb-1">👤</div>
//                   <div className="text-sm text-gray-400">Real Image</div>
//                   <div className={`text-2xl font-bold ${
//                     result.probability_real > 50 ? 'text-green-400' : 'text-gray-300'
//                   }`}>
//                     {result.probability_real}%
//                   </div>
//                 </div>
//               </div>
              
//               {/* Filename */}
//               <div className="mt-4 pt-4 border-t border-gray-700">
//                 <p className="text-xs text-gray-400 truncate">
//                   📁 {result.filename}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Loading State */}
//         {loading && (
//           <div className="mt-8 bg-gray-800 rounded-lg p-8 text-center">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-4"></div>
//             <p className="text-gray-300">Analyzing image with AI model...</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
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