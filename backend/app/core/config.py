"""
Configuration settings for the application.
Loads environment variables and provides application-wide settings.
"""
import os
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Configuration
    app_name: str = "AI-Powered Fact Checker API"
    app_version: str = "1.0.0"
    debug: bool = False
    host: str = "127.0.0.1"
    port: int = 8000
    
    # Gemini Configuration
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"
    
    # CORS Configuration
    cors_origins: list[str] = ["*"]  # In production, use specific origins
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """
    Create and cache settings instance.
    Using lru_cache ensures we only load settings once.
    """
    return Settings()


settings = get_settings()
