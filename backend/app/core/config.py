"""
NutriSutra Backend Configuration

Reads environment variables with safe defaults.
All image AI features are opt-in via explicit flags.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # OpenRouter
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "openai/gpt-4.1-mini"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1/chat/completions"
    OPENROUTER_TIMEOUT_SECONDS: int = 30

    # Feature flags
    ENABLE_OPENROUTER_IMAGE_ANALYSIS: bool = False
    ENABLE_IMAGE_RESULT_PERSISTENCE: bool = True

    # Upload limits
    MAX_IMAGE_UPLOAD_MB: int = 5

    # CORS — frontend origin(s)
    CORS_ORIGINS: list[str] = [
        "https://nutrisutra.srpailabs.com",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
    ]

    # Admin & notifications
    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_CHAT_ID: str = ""
    ADMIN_EMAIL: str = "pasikantishashank24@gmail.com"
    ADMIN_API_KEY: str = "ns_admin_shashank_2026_srpai"

    # JWT auth
    JWT_SECRET: str = "nutrisutra_jwt_fallback_2026_change_in_prod"

    @property
    def max_image_bytes(self) -> int:
        return self.MAX_IMAGE_UPLOAD_MB * 1024 * 1024

    @property
    def is_openrouter_ready(self) -> bool:
        """True only when both the flag is on AND an API key is present."""
        return bool(self.ENABLE_OPENROUTER_IMAGE_ANALYSIS and self.OPENROUTER_API_KEY)

    @property
    def is_telegram_ready(self) -> bool:
        return bool(self.TELEGRAM_BOT_TOKEN and self.TELEGRAM_CHAT_ID)

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
