import asyncio
import logging
from unittest.mock import MagicMock, AsyncMock

# Configure logging to see our cache hits/misses
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app.services.gemini")
logger.setLevel(logging.INFO)

# We need to mock the settings before importing GeminiService
import sys
from unittest.mock import patch

with patch('app.core.config.settings') as mock_settings:
    mock_settings.gemini_api_key = "fake_key"
    mock_settings.gemini_model = "gemini-3-flash-preview"
    
    from app.services.gemini import GeminiService

async def test_caching():
    print("--- Starting Caching Test ---")
    service = GeminiService()
    
    # Mock the _make_request method to return a successful response always
    mock_response_data = {
        "candidates": [
            {
                "content": {
                    "parts": [{"text": '{"summaryVerdict": "True", "claims": []}'}]
                },
                "groundingMetadata": {}
            }
        ]
    }
    service._make_request = AsyncMock(return_value=mock_response_data)
    
    input_text = "Test input for caching."
    
    print("\n[Step 1] First Request (Should be Cache MISS)")
    result1 = await service.analyze_text(input_text)
    print(f"Result 1 ID: {result1['id']}")
    print(f"API Call Count: {service._make_request.call_count}")
    
    assert service._make_request.call_count == 1, "API should have been called once"
    
    print("\n[Step 2] Second Request (Should be Cache HIT)")
    result2 = await service.analyze_text(input_text)
    print(f"Result 2 ID: {result2['id']}")
    print(f"API Call Count: {service._make_request.call_count}")
    
    assert service._make_request.call_count == 1, "API should NOT have been called again"
    assert result1['id'] != result2['id'], "Cached result should have a new ID"
    assert result1['summaryVerdict'] == result2['summaryVerdict'], "Content should match"
    
    print("\n--- Test Passed! Caching is working. ---")

if __name__ == "__main__":
    asyncio.run(test_caching())
