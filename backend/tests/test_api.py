import asyncio
import logging
import sys
from unittest.mock import patch, AsyncMock

# Add project root to path
sys.path.append(".")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("tests.api")

# We need to mock settings before importing app
with patch('app.core.config.settings') as mock_settings:
    mock_settings.gemini_api_key = "fake_key"
    mock_settings.gemini_model = "fake_model" # Should be gemini-3-flash-preview or similar
    mock_settings.app_name = "VeriFact AI"
    mock_settings.app_version = "1.0.0"
    mock_settings.debug = True
    mock_settings.cors_origins = ["*"]

    from app.main import app
    from fastapi.testclient import TestClient

    def test_health_check():
        print("\n--- Testing Health Check Endpoint ---")
        client = TestClient(app)
        response = client.get("/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
        assert response.json()["message"] == "VeriFact AI is running"
        print("--- Health Check Passed! ---")

    def test_analyze_text_mocked():
        print("\n--- Testing Analyze Text Endpoint (Mocked) ---")
        
        # Mock the GeminiService analyze_text method
        with patch('app.api.routes.analysis.get_gemini_service') as mock_get_service:
            mock_service = AsyncMock()
            mock_service.analyze_text.return_value = {
                "id": "mock-id-123",
                "score": 95.0,
                "summaryVerdict": "Mostly True",
                "claims": [],
                "searchQueries": ["test query"],
                "timestamp": "2023-01-01T00:00:00Z",
                "inputPreview": "Test input..."
            }
            mock_get_service.return_value = mock_service
            
            client = TestClient(app)
            payload = {"text": "This is a test claim."}
            response = client.post("/analyze-text", json=payload)
            
            print(f"Status Code: {response.status_code}")
            # print(f"Response: {response.json()}")
            
            assert response.status_code == 200
            data = response.json()
            assert data["score"] == 95.0
            assert data["summaryVerdict"] == "Mostly True"
            print("--- Analyze Text Passed! ---")

    def test_analyze_text_empty():
        print("\n--- Testing Analyze Text Endpoint (Empty Input) ---")
        client = TestClient(app)
        # Assuming Pydantic handles validation, empty string might still pass unless constrained. 
        # But missing field should fail.
        response = client.post("/analyze-text", json={}) # Missing 'text'
        print(f"Status Code: {response.status_code}")
        
        assert response.status_code == 422
        print("--- Empty Input Handling Passed! ---")

if __name__ == "__main__":
    test_health_check()
    test_analyze_text_mocked()
    test_analyze_text_empty()
