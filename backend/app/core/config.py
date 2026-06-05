from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "AcadFlow API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = "" # Service Key
    
    # JWT
    JWT_SECRET: str = "random_long_string"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS
    CORS_ORIGINS: list[str] = ["*"]
    
    # Email (Resend)
    GEMINI_API_KEY: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None
    RESEND_API_KEY: Optional[str] = None
    EMAIL_FROM: str = "AcadFlow <noreply@acadflow.com>"
    
    # Storage
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_EXTENSIONS: dict = {
        "ca1": ["ppt", "pptx"],
        "ca2": ["pdf", "doc", "docx"],
        "signatures": ["png", "jpg", "jpeg"]
    }
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


settings = Settings()
