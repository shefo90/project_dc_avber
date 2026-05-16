import ssl
import pg8000
from urllib.parse import urlparse, unquote
from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings


def _make_engine():
    raw = settings.database_url
    parsed = urlparse(raw)

    host = parsed.hostname
    port = int(parsed.port or 5432)
    database = parsed.path.lstrip("/")
    username = unquote(parsed.username or "")
    password = unquote(parsed.password or "")

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    def creator():
        return pg8000.connect(
            user=username,
            host=host,
            port=port,
            database=database,
            password=password,
            ssl_context=ctx,
        )

    # NullPool is correct for serverless: each Lambda gets its own process
    return create_engine("postgresql+pg8000://", creator=creator, poolclass=NullPool)


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
