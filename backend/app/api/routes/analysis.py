"""
Fact-checking analysis endpoints.
"""
from fastapi import APIRouter, HTTPException, UploadFile, File

from app.models.schemas import FactCheckRequest, FactCheckResponse
from app.services.gemini import get_gemini_service

router = APIRouter()


@router.post("/analyze-text", response_model=FactCheckResponse)
async def analyze_text(request: FactCheckRequest):
    """
    Analyze text content for factual claims.
    
    Args:
        request: FactCheckRequest with text field
        
    Returns:
        FactCheckResponse with claims, verdicts, and credibility score
        
    Raises:
        HTTPException: If analysis fails
    """
    try:
        gemini_service = get_gemini_service()
        result = await gemini_service.analyze_text(request.text)
        return FactCheckResponse(**result)
    except Exception as e:
        error_msg = str(e)
        print(f"Error analyzing text: {error_msg}")
        
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
    
    Args:
        file: Uploaded image file
        
    Returns:
        FactCheckResponse with claims extracted from image
        
    Raises:
        HTTPException: If analysis fails
    """
    try:
        # Read file content
        content = await file.read()
        
        gemini_service = get_gemini_service()
        result = await gemini_service.analyze_image(
            file_content=content,
            filename=file.filename or "unknown",
            content_type=file.content_type or "image/jpeg"
        )
        return FactCheckResponse(**result)
    except Exception as e:
        error_msg = str(e)
        print(f"Error analyzing image: {error_msg}")
        
        status_code = 500
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            status_code = 429
            error_msg = "Gemini API quota exceeded. Please wait a moment before trying again."
            
        raise HTTPException(
            status_code=status_code,
            detail=error_msg
        )
