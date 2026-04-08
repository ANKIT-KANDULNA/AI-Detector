// frontend/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export type ModelType = 'cnn' | 'gan';

export interface PredictionResult {
  success: boolean;
  model_used: 'CNN' | 'GAN';          // ← new field from backend
  prediction: 'REAL' | 'FAKE';
  confidence: number;
  probability_fake: number;
  probability_real: number;
  filename: string;
}

export async function predictImage(file: File, modelType: ModelType = 'cnn'): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_URL}/predict?model_type=${modelType}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Prediction failed: ${response.statusText}`);
  }

  return response.json();
}

export async function checkHealth(): Promise<{ status: string; cnn_loaded: boolean; gan_loaded: boolean }> {
  const response = await fetch(`${API_URL}/health`);
  return response.json();
}