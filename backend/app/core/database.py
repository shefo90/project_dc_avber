import ssl
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings


def _make_engine():
    url = settings.database_url
    # pg8000 is pure Python (works on Vercel Lambda); psycopg2 binary does not
    if url.startswith("postgresql://") or url.startswith("postgres://"):
        url = url.replace("://", "+pg8000://", 1)

    # Supabase pooler requires SSL; pg8000 needs the context passed explicitly
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    return create_engine(url, connect_args={"ssl_context": ctx})


engine = _make_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
