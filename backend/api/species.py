"""Species identification API endpoints."""
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from schemas.models import TrainResponse, ModelStatus, SpeciesPrediction
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/species", tags=["Species Identification"])

# Service instance — set by main.py
service = None


def set_service(svc):
    global service
    service = svc


@router.post("/train", response_model=TrainResponse)
async def train_model(background_tasks: BackgroundTasks, epochs: int = 5, batch_size: int = 16):
    """Train the species identification model in the background."""
    if service.status == "training":
        raise HTTPException(status_code=400, detail="Model is already training.")
    
    background_tasks.add_task(service.train, epochs=epochs, batch_size=batch_size)
    
    return TrainResponse(
        status="success",
        message="Species model training started in background",
        metrics={},
        training_time_seconds=0.0
    )


@router.post("/predict", response_model=SpeciesPrediction)
async def predict_species(file: UploadFile = File(...)):
    """Identify species from an uploaded image."""
    if service.status != "ready":
        raise HTTPException(status_code=400, detail="Model not trained. Train the model first.")

    try:
        image_bytes = await file.read()
        result = service.predict(image_bytes)
        return SpeciesPrediction(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status", response_model=ModelStatus)
async def get_status():
    """Get species model status."""
    return ModelStatus(**service.get_status())
