"""Pydantic schemas for ML API request/response models."""
from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime


class TrainRequest(BaseModel):
    """Request schema for model training."""
    epochs: Optional[int] = None
    batch_size: Optional[int] = None
    learning_rate: Optional[float] = None


class TrainResponse(BaseModel):
    """Response after training a model."""
    status: str
    message: str
    metrics: dict[str, Any] = {}
    training_time_seconds: float = 0.0


class ModelStatus(BaseModel):
    """Current status of an ML model."""
    name: str
    status: str = "untrained"  # untrained | training | ready | error
    metrics: dict[str, Any] = {}
    last_trained: Optional[str] = None
    error: Optional[str] = None


class SpeciesPredictionItem(BaseModel):
    """A single species prediction."""
    name: str
    confidence: float


class SpeciesPrediction(BaseModel):
    """Response for species identification."""
    name: str
    confidence: float
    top_predictions: list[SpeciesPredictionItem] = []
    model_metrics: dict[str, Any] = {}


class StockForecastPoint(BaseModel):
    """A single point in a stock forecast."""
    date: str
    value: float
    lower_bound: float
    upper_bound: float


class StockPrediction(BaseModel):
    """Response for fish stock prediction."""
    forecast: list[StockForecastPoint] = []
    model_metrics: dict[str, Any] = {}
    region: str = "Global"


class OtolithInput(BaseModel):
    """Input for otolith age prediction."""
    length: float = Field(..., description="Otolith length in mm")
    width: float = Field(..., description="Otolith width in mm")
    aspect_ratio: Optional[float] = None
    circularity: Optional[float] = None
    perimeter: Optional[float] = None
    weight: Optional[float] = None


class OtolithPrediction(BaseModel):
    """Response for otolith age prediction."""
    predicted_age: float
    confidence_interval: list[float] = []
    feature_importance: dict[str, float] = {}
    model_metrics: dict[str, Any] = {}


class EDNAInput(BaseModel):
    """Input for eDNA classification."""
    sequence: str = Field(..., description="DNA sequence (ATCG string)")


class EDNAPrediction(BaseModel):
    """Response for eDNA species classification."""
    species: str
    confidence: float
    top_predictions: list[SpeciesPredictionItem] = []
    biodiversity_index: float = 0.0
    model_metrics: dict[str, Any] = {}


class StockPredictRequest(BaseModel):
    """Request for stock prediction."""
    months_ahead: int = 12
    region: str = "Global"


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = "healthy"
    models: dict[str, str] = {}
    version: str = "1.0.0"
