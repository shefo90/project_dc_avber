from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings


def _build_url(url: str) -> str:
    # Vercel Lambda can't use psycopg2 (binary). Force pg8000 (pure Python).
    if url.startswith("postgresql://") or url.startswith("postgres://"):
        url = url.replace("://", "+pg8000://", 1)
    return url


engine = create_engine(_build_url(settings.database_url))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
