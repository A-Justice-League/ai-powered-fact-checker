import logging
import sys
import json
import contextvars
from datetime import datetime
from typing import Any, Dict

from app.core.config import settings

# Context variable to store request ID
request_id_ctx_var: contextvars.ContextVar[str] = contextvars.ContextVar("request_id", default="")

class RequestIDFilter(logging.Filter):
    """
    Filter that injects the current request_id from context into the log record.
    """
    def filter(self, record):
        record.request_id = request_id_ctx_var.get()
        return True

class JSONFormatter(logging.Formatter):
    """
    Custom formatter that outputs logs in JSON format.
    """
    def format(self, record: logging.LogRecord) -> str:
        log_record: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "funcName": record.funcName,
            "line": record.lineno,
        }
        
        # Add extra fields if present
        if hasattr(record, "request_id"):
            log_record["request_id"] = record.request_id
            
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_record)

def setup_logging():
    """
    Configure logging for the application.
    """
    log_level = logging.DEBUG if settings.debug else logging.INFO
    
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    
    # Remove existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
        
    # Create console handler
    handler = logging.StreamHandler(sys.stdout)
    handler.addFilter(RequestIDFilter())
    
    if not settings.debug:
        # Use JSON formatter in production
        handler.setFormatter(JSONFormatter())
    else:
        # Use standard formatter in development
        handler.setFormatter(logging.Formatter(
            "%(asctime)s - [%(request_id)s] - %(name)s - %(levelname)s - %(message)s"
        ))
        
    root_logger.addHandler(handler)
    
    # Set levels for some talkative libraries
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    
    logging.info(f"Logging configured with level: {logging.getLevelName(log_level)}")
