from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        # env vars always take priority over .env file (works on Vercel)
        case_sensitive = False


settings = Settings()
