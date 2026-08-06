// frontend/lib/api.ts
const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_URL = rawUrl.replace(/\/$/, '');

export type ModelType = 'cnn' | 'gan' | 'ensemble';

export interface PredictionResult {
  success: boolean;
  mode_used: string;
  prediction: 'REAL' | 'FAKE';
  confidence: number;
  details?: Record<string, any>;
  filename: string;
  model_name?: string;
}

export async function fetchAvailableModels(): Promise<string[]> {
  const response = await fetch(`${API_URL}/models`);
  if (!response.ok) {
    return ['best'];
  }
  const data = await response.json();
  return data.models || ['best'];
}

export async function predictImage(
  file: File, 
  modelType: ModelType = 'cnn',
  modelName: string = 'best',
  threshold: number = 0.35
): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(
    `${API_URL}/predict?mode=${modelType}&model_name=${modelName}&threshold=${threshold}`, 
    {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Prediction failed: ${response.statusText}`);
  }

  return response.json();
}

export async function checkHealth(): Promise<any> {
  const response = await fetch(`${API_URL}/`);
  return response.json();
}