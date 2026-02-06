"""
Gemini AI service for fact-checking.
Handles all interactions with the Gemini API directly via REST for maximum control.
"""
import json
import re
import uuid
import base64
import httpx
from datetime import datetime
from typing import Dict, Any

from app.core.config import settings
from app.models.schemas import Source, Claim
from app.utils.scoring import calculate_credibility_score


class GeminiService:
    """Service for interacting with Gemini AI API directly via REST."""
    
    def __init__(self):
        """Initialize service settings."""
        if not settings.gemini_api_key:
            raise ValueError("GEMINI_API_KEY not configured in environment")
        
        self.api_key = settings.gemini_api_key
        self.model = settings.gemini_model
        # Use the standard Generative Language API endpoint
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"
        
    def _get_fact_check_prompt(self) -> str:
        """
        Generate the fact-checking prompt for Gemini.
        """
        return """
        You are a professional fact-checking assistant. 
        Analyze the provided content and extract the key factual claims.
        For each claim, use Google Search to verify its accuracy.
        
        Response Format Schema:
        {
            "summaryVerdict": "A brief overview of the overall truthfulness",
            "claims": [
                {
                    "text": "The exact claim extracted",
                    "verdict": "TRUE" | "FALSE" | "UNSURE",
                    "explanation": "Brief reasoning based on search results",
                    "sources": [
                        {
                            "domain": "example.com",
                            "title": "Page Title",
                            "url": "https://example.com/source"
                        }
                    ]
                }
            ]
        }
        """
    
    def _parse_gemini_response(self, response_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parse Gemini REST response into structured JSON.
        """
        try:
            # Extract text from the first candidate
            candidates = response_data.get("candidates", [])
            if not candidates:
                raise ValueError(f"No candidates in Gemini response: {response_data}")
            
            text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            
            # Remove markdown code blocks if present
            text = re.sub(r'```json\n?|\n?```', '', text).strip()
            
            return json.loads(text)
        except (json.JSONDecodeError, IndexError, KeyError) as e:
            # Fallback: Extract JSON using regex if direct parsing fails
            if "candidates" in response_data:
                text = response_data["candidates"][0]["content"]["parts"][0]["text"]
                json_match = re.search(r'\{.*\}', text, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
            
            raise ValueError(f"Could not parse Gemini response: {str(e)}")
    
    def _process_claims(self, raw_claims: list) -> tuple[list[Claim], float]:
        """
        Process raw claims into Claim objects with unique IDs.
        """
        claims = []
        for idx, c in enumerate(raw_claims):
            claim_id = f"c{idx+1}-{str(uuid.uuid4())[:8]}"
            claims.append(Claim(
                id=claim_id,
                text=c.get("text", ""),
                verdict=c.get("verdict", "UNSURE"),
                explanation=c.get("explanation", ""),
                sources=[Source(**s) for s in c.get("sources", [])]
            ))
        
        score = calculate_credibility_score(raw_claims)
        return claims, score

    async def _make_request(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Helper to make the REST call to Gemini API."""
        url = f"{self.base_url}/models/{self.model}:generateContent?key={self.api_key}"
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, json=payload)
            
            if response.status_code != 200:
                error_msg = response.text
                try:
                    error_json = response.json()
                    error_msg = error_json.get("error", {}).get("message", response.text)
                except:
                    pass
                raise Exception(f"Gemini API Error ({response.status_code}): {error_msg}")
            
            return response.json()

    def _extract_search_queries(self, response_data: Dict[str, Any]) -> list[str]:
        """Extract search queries from Gemini's grounding metadata."""
        try:
            metadata = response_data.get("candidates", [{}])[0].get("groundingMetadata", {})
            return metadata.get("webSearchQueries", [])
        except:
            return []

    async def analyze_text(self, text: str) -> Dict[str, Any]:
        """Analyze text using Gemini REST API."""
        input_preview = (text[:150] + '...') if len(text) > 150 else text
        prompt = self._get_fact_check_prompt() + f"\n\nText to analyze:\n{text}"
        
        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ],
            "tools": [
                {"googleSearch": {}}
            ],
            "generationConfig": {
                "responseMimeType": "application/json"
            }
        }
        
        response_data = await self._make_request(payload)
        result = self._parse_gemini_response(response_data)
        claims, score = self._process_claims(result.get("claims", []))
        search_queries = self._extract_search_queries(response_data)
        
        return {
            "id": str(uuid.uuid4()),
            "score": score,
            "summaryVerdict": result.get("summaryVerdict", ""),
            "claims": claims,
            "searchQueries": search_queries,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "inputPreview": input_preview
        }
    
    async def analyze_image(self, file_content: bytes, filename: str, content_type: str) -> Dict[str, Any]:
        """Analyze image using Gemini REST API with multimodal input."""
        input_preview = f"Image: {filename}"
        prompt = self._get_fact_check_prompt()
        
        # Base64 encode image for REST API
        image_base64 = base64.b64encode(file_content).decode('utf-8')
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "inlineData": {
                                "mimeType": content_type,
                                "data": image_base64
                            }
                        },
                        {
                            "text": prompt
                        }
                    ]
                }
            ],
            "tools": [
                {"googleSearch": {}}
            ],
            "generationConfig": {
                "responseMimeType": "application/json"
            }
        }
        
        response_data = await self._make_request(payload)
        result = self._parse_gemini_response(response_data)
        claims, score = self._process_claims(result.get("claims", []))
        search_queries = self._extract_search_queries(response_data)
        
        return {
            "id": str(uuid.uuid4()),
            "score": score,
            "summaryVerdict": result.get("summaryVerdict", ""),
            "claims": claims,
            "searchQueries": search_queries,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "inputPreview": input_preview
        }


# Singleton instance
_gemini_service: GeminiService | None = None


def get_gemini_service() -> GeminiService:
    """Get GeminiService singleton instance."""
    global _gemini_service
    if _gemini_service is None:
        _gemini_service = GeminiService()
    return _gemini_service
