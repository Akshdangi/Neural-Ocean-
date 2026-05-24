"""eDNA classification API endpoints."""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from schemas.models import TrainResponse, ModelStatus, EDNAPrediction, EDNAInput
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/edna", tags=["eDNA Classification"])

# Service instance — set by main.py
service = None


def set_service(svc):
    global service
    service = svc


@router.post("/train", response_model=TrainResponse)
async def train_model(background_tasks: BackgroundTasks):
    """Train the eDNA classification model in the background."""
    if service.status == "training":
        raise HTTPException(status_code=400, detail="Model is already training.")
    
    background_tasks.add_task(service.train)
    
    return TrainResponse(
        status="success",
        message="eDNA model training started in background",
        metrics={},
        training_time_seconds=0.0
    )


@router.post("/predict", response_model=EDNAPrediction)
async def predict_species(data: EDNAInput):
    """Classify species from eDNA sequence."""
    if service.status != "ready":
        raise HTTPException(status_code=400, detail="Model not trained. Train the model first.")

    if len(data.sequence) < 20:
        raise HTTPException(status_code=400, detail="Sequence too short. Minimum 20 base pairs.")

    try:
        result = service.predict(data.sequence)
        return EDNAPrediction(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status", response_model=ModelStatus)
async def get_status():
    """Get eDNA model status."""
    return ModelStatus(**service.get_status())
