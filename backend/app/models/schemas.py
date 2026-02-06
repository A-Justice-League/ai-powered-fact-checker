"""
Pydantic schemas for request/response validation.
"""
from typing import List
from pydantic import BaseModel


class FactCheckRequest(BaseModel):
    """Request model for text fact-checking."""
    text: str


class Source(BaseModel):
    """Source citation from Google Search Grounding."""
    domain: str
    title: str
    url: str


class Claim(BaseModel):
    """Individual claim with verdict and supporting evidence."""
    id: str
    text: str
    verdict: str  # TRUE, FALSE, UNSURE
    explanation: str
    sources: List[Source]


class FactCheckResponse(BaseModel):
    """Response model for fact-check analysis."""
    id: str
    score: float
    summaryVerdict: str
    claims: List[Claim]
    searchQueries: List[str] = [] # New field for Gemini 3 search queries
    timestamp: str
    inputPreview: str
