"""
Health check endpoint.
"""
from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/")
async def health_check():
    """
    Health check endpoint to verify the API is running.
    
    Returns:
        JSON with service status and version
    """
    return {
        "message": f"{settings.app_name} is running",
        "version": settings.app_version,
        "status": "healthy"
    }
