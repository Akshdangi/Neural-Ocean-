"""Fish stock prediction API endpoints."""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from schemas.models import TrainResponse, ModelStatus, StockPrediction, StockPredictRequest
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/stock", tags=["Fish Stock Prediction"])

# Service instance — set by main.py
service = None


def set_service(svc):
    global service
    service = svc


@router.post("/train", response_model=TrainResponse)
async def train_model(background_tasks: BackgroundTasks, epochs: int = 30, batch_size: int = 32):
    """Train the stock prediction LSTM model in the background."""
    if service.status == "training":
        raise HTTPException(status_code=400, detail="Model is already training.")
    
    background_tasks.add_task(service.train, epochs=epochs, batch_size=batch_size)
    
    return TrainResponse(
        status="success",
        message="Stock prediction model training started in background",
        metrics={},
        training_time_seconds=0.0
    )


@router.post("/predict", response_model=StockPrediction)
async def predict_stock(request: StockPredictRequest):
    """Predict future fish stock levels."""
    if service.status != "ready":
        raise HTTPException(status_code=400, detail="Model not trained. Train the model first.")

    try:
        result = service.predict(
            months_ahead=request.months_ahead,
            region=request.region
        )
        return StockPrediction(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status", response_model=ModelStatus)
async def get_status():
    """Get stock model status."""
    return ModelStatus(**service.get_status())
