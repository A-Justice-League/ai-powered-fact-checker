import logging
from fastapi import APIRouter, HTTPException, UploadFile, File

from app.models.schemas import FactCheckRequest, FactCheckResponse
from app.services.gemini import get_gemini_service

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/analyze-text", response_model=FactCheckResponse)
async def analyze_text(request: FactCheckRequest):
    """
    Analyze text content for factual claims.
    """
    logger.info(f"Received text analysis request: {request.text[:50]}...")
    try:
        gemini_service = get_gemini_service()
        result = await gemini_service.analyze_text(request.text)
        logger.info(f"Text analysis complete for request. Generated {len(result.get('claims', []))} claims.")
        return FactCheckResponse(**result)
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error analyzing text: {error_msg}", exc_info=True)
        
        status_code = 500
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            status_code = 429
            error_msg = "Gemini API quota exceeded. Please wait a moment before trying again."
            
        raise HTTPException(
            status_code=status_code,
            detail=error_msg
        )


@router.post("/analyze-image", response_model=FactCheckResponse)
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze image content for factual claims using multimodal AI.
    """
    logger.info(f"Received image analysis request: {file.filename}")
    try:
        # Read file content
        content = await file.read()
        
        gemini_service = get_gemini_service()
        result = await gemini_service.analyze_image(
            file_content=content,
            filename=file.filename or "unknown",
            content_type=file.content_type or "image/jpeg"
        )
        logger.info(f"Image analysis complete for {file.filename}. Generated {len(result.get('claims', []))} claims.")
        return FactCheckResponse(**result)
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error analyzing image: {error_msg}", exc_info=True)
        
        status_code = 500
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            status_code = 429
            error_msg = "Gemini API quota exceeded. Please wait a moment before trying again."
            
        raise HTTPException(
            status_code=status_code,
            detail=error_msg
        )


@router.get("/metrics")
async def get_metrics():
    """
    Get application metrics, including cache statistics.
    """
    try:
        gemini_service = get_gemini_service()
        stats = gemini_service.get_cache_stats()
        return {
            "cache": stats
        }
    except Exception as e:
         logger.error(f"Error getting metrics: {e}", exc_info=True)
         return {"error": str(e)}
