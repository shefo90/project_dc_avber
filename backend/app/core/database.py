import ssl
from urllib.parse import urlparse, unquote
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings


def _make_engine():
    raw = settings.database_url
    parsed = urlparse(raw)
    url = URL.create(
        drivername="postgresql+pg8000",
        username=unquote(parsed.username or ""),
        password=unquote(parsed.password or ""),
        host=parsed.hostname,
        port=parsed.port,
        database=parsed.path.lstrip("/"),
    )

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
