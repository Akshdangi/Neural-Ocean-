"""Otolith age prediction API endpoints."""
from fastapi import APIRouter, HTTPException
from schemas.models import TrainResponse, ModelStatus, OtolithPrediction, OtolithInput
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/otolith", tags=["Otolith Age Prediction"])

service = None


def set_service(svc):
    global service
    service = svc


@router.post("/train", response_model=TrainResponse)
async def train_model():
    """Train the otolith age prediction model."""
    try:
        metrics = service.train()
        return TrainResponse(
            status="success",
            message="Otolith model trained successfully",
            metrics=metrics,
            training_time_seconds=metrics.get("training_time_seconds", 0)
        )
    except Exception as e:
        logger.error(f"Training failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/predict", response_model=OtolithPrediction)
async def predict_age(data: OtolithInput):
    """Predict fish age from otolith measurements."""
    if service.status != "ready":
        raise HTTPException(status_code=400, detail="Model not trained. Train the model first.")

    try:
        result = service.predict(
            length=data.length,
            width=data.width,
            aspect_ratio=data.aspect_ratio,
            circularity=data.circularity,
            perimeter=data.perimeter,
            weight=data.weight,
        )
        return OtolithPrediction(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status", response_model=ModelStatus)
async def get_status():
    """Get otolith model status."""
    return ModelStatus(**service.get_status())
