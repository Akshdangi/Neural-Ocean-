"""Neural Ocean ML Backend — FastAPI application entry point."""
import os
import sys
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add backend directory to path so imports work
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from api import species as species_api
from api import stock as stock_api
from api import otolith as otolith_api
from api import edna as edna_api
from services.species_model import SpeciesModelService
from services.stock_model import StockModelService
from services.otolith_model import OtolithModelService
from services.edna_model import EDNAModelService
from schemas.models import HealthResponse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create model directory
MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
os.makedirs(MODELS_DIR, exist_ok=True)

# Initialize services
species_service = SpeciesModelService()
stock_service = StockModelService()
otolith_service = OtolithModelService()
edna_service = EDNAModelService()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load saved models on startup."""
    logger.info("=" * 60)
    logger.info("Neural Ocean ML Backend starting...")
    logger.info("=" * 60)

    # Try to load previously saved models
    loaded = []
    if species_service.load_model():
        loaded.append("Species")
    if stock_service.load_model():
        loaded.append("Stock")
    if otolith_service.load_model():
        loaded.append("Otolith")
    if edna_service.load_model():
        loaded.append("eDNA")

    if loaded:
        logger.info(f"Loaded saved models: {', '.join(loaded)}")
    else:
        logger.info("No saved models found. Train models via the API.")

    # Inject services into routers
    species_api.set_service(species_service)
    stock_api.set_service(stock_service)
    otolith_api.set_service(otolith_service)
    edna_api.set_service(edna_service)

    logger.info("All services initialized. API is ready.")
    logger.info("=" * 60)

    yield

    logger.info("Shutting down Neural Ocean ML Backend...")


# Create FastAPI app
app = FastAPI(
    title="Neural Ocean ML API",
    description="AI-Driven Marine Knowledge Graph Platform — Machine Learning Backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware — allow frontend at localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(species_api.router)
app.include_router(stock_api.router)
app.include_router(otolith_api.router)
app.include_router(edna_api.router)


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint with model statuses."""
    return HealthResponse(
        status="healthy",
        models={
            "species": species_service.status,
            "stock": stock_service.status,
            "otolith": otolith_service.status,
            "edna": edna_service.status,
        },
        version="1.0.0"
    )


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "Neural Ocean ML API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
