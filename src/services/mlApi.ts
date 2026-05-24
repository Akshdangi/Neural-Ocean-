/**
 * Neural Ocean ML API Client
 * Centralized API calls to the FastAPI ML backend.
 */

const API_BASE = '/api';

// ─── Health ──────────────────────────────────────────────
export interface HealthResponse {
  status: string;
  models: Record<string, string>;
  version: string;
}

export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Backend not reachable');
  return res.json();
}

// ─── Model Status ────────────────────────────────────────
export interface ModelStatus {
  name: string;
  status: 'untrained' | 'training' | 'ready' | 'error';
  metrics: Record<string, any>;
  last_trained: string | null;
  error: string | null;
}

// ─── Training ────────────────────────────────────────────
export interface TrainResponse {
  status: string;
  message: string;
  metrics: Record<string, any>;
  training_time_seconds: number;
}

// ─── Species ─────────────────────────────────────────────
export interface SpeciesPrediction {
  name: string;
  confidence: number;
  top_predictions: { name: string; confidence: number }[];
  model_metrics: Record<string, any>;
}

export async function trainSpeciesModel(epochs = 5): Promise<TrainResponse> {
  const res = await fetch(`${API_BASE}/species/train?epochs=${epochs}`, { method: 'POST' });
  if (!res.ok) throw new Error((await res.json()).detail || 'Training failed');
  return res.json();
}

export async function predictSpecies(file: File): Promise<SpeciesPrediction> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/species/predict`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error((await res.json()).detail || 'Prediction failed');
  return res.json();
}

export async function getSpeciesStatus(): Promise<ModelStatus> {
  const res = await fetch(`${API_BASE}/species/status`);
  if (!res.ok) throw new Error('Failed to get status');
  return res.json();
}

// ─── Stock ───────────────────────────────────────────────
export interface StockForecastPoint {
  date: string;
  value: number;
  lower_bound: number;
  upper_bound: number;
}

export interface StockPrediction {
  forecast: StockForecastPoint[];
  model_metrics: Record<string, any>;
  region: string;
}

export async function trainStockModel(epochs = 30): Promise<TrainResponse> {
  const res = await fetch(`${API_BASE}/stock/train?epochs=${epochs}`, { method: 'POST' });
  if (!res.ok) throw new Error((await res.json()).detail || 'Training failed');
  return res.json();
}

export async function predictStock(monthsAhead = 12, region = 'Global'): Promise<StockPrediction> {
  const res = await fetch(`${API_BASE}/stock/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ months_ahead: monthsAhead, region }),
  });
  if (!res.ok) throw new Error((await res.json()).detail || 'Prediction failed');
  return res.json();
}

export async function getStockStatus(): Promise<ModelStatus> {
  const res = await fetch(`${API_BASE}/stock/status`);
  if (!res.ok) throw new Error('Failed to get status');
  return res.json();
}

// ─── Otolith ─────────────────────────────────────────────
export interface OtolithPrediction {
  predicted_age: number;
  confidence_interval: number[];
  feature_importance: Record<string, number>;
  model_metrics: Record<string, any>;
}

export async function trainOtolithModel(): Promise<TrainResponse> {
  const res = await fetch(`${API_BASE}/otolith/train`, { method: 'POST' });
  if (!res.ok) throw new Error((await res.json()).detail || 'Training failed');
  return res.json();
}

export async function predictOtolith(measurements: {
  length: number;
  width: number;
  aspect_ratio?: number;
  circularity?: number;
  perimeter?: number;
  weight?: number;
}): Promise<OtolithPrediction> {
  const res = await fetch(`${API_BASE}/otolith/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(measurements),
  });
  if (!res.ok) throw new Error((await res.json()).detail || 'Prediction failed');
  return res.json();
}

export async function getOtolithStatus(): Promise<ModelStatus> {
  const res = await fetch(`${API_BASE}/otolith/status`);
  if (!res.ok) throw new Error('Failed to get status');
  return res.json();
}

// ─── eDNA ────────────────────────────────────────────────
export interface EDNAPrediction {
  species: string;
  confidence: number;
  top_predictions: { name: string; confidence: number }[];
  biodiversity_index: number;
  model_metrics: Record<string, any>;
}

export async function trainEDNAModel(): Promise<TrainResponse> {
  const res = await fetch(`${API_BASE}/edna/train`, { method: 'POST' });
  if (!res.ok) throw new Error((await res.json()).detail || 'Training failed');
  return res.json();
}

export async function predictEDNA(sequence: string): Promise<EDNAPrediction> {
  const res = await fetch(`${API_BASE}/edna/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sequence }),
  });
  if (!res.ok) throw new Error((await res.json()).detail || 'Prediction failed');
  return res.json();
}

export async function getEDNAStatus(): Promise<ModelStatus> {
  const res = await fetch(`${API_BASE}/edna/status`);
  if (!res.ok) throw new Error('Failed to get status');
  return res.json();
}

// ─── Utility ─────────────────────────────────────────────
export type ModelType = 'species' | 'stock' | 'otolith' | 'edna';

export async function getModelStatus(model: ModelType): Promise<ModelStatus> {
  switch (model) {
    case 'species': return getSpeciesStatus();
    case 'stock': return getStockStatus();
    case 'otolith': return getOtolithStatus();
    case 'edna': return getEDNAStatus();
  }
}

export async function trainModel(model: ModelType): Promise<TrainResponse> {
  switch (model) {
    case 'species': return trainSpeciesModel();
    case 'stock': return trainStockModel();
    case 'otolith': return trainOtolithModel();
    case 'edna': return trainEDNAModel();
  }
}

export async function getAllStatuses(): Promise<Record<ModelType, ModelStatus>> {
  const [species, stock, otolith, edna] = await Promise.all([
    getSpeciesStatus().catch(() => ({ name: 'Species', status: 'error' as const, metrics: {}, last_trained: null, error: 'Backend not reachable' })),
    getStockStatus().catch(() => ({ name: 'Stock', status: 'error' as const, metrics: {}, last_trained: null, error: 'Backend not reachable' })),
    getOtolithStatus().catch(() => ({ name: 'Otolith', status: 'error' as const, metrics: {}, last_trained: null, error: 'Backend not reachable' })),
    getEDNAStatus().catch(() => ({ name: 'eDNA', status: 'error' as const, metrics: {}, last_trained: null, error: 'Backend not reachable' })),
  ]);
  return { species, stock, otolith, edna };
}
