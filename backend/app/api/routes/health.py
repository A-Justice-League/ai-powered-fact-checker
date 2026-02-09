import logging
from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/")
async def health_check():
    """
    Health check endpoint to verify the API is running.
    """
    logger.debug("Health check requested")
    return {
        "message": f"{settings.app_name} is running",
        "version": settings.app_version,
        "status": "healthy"
    }
