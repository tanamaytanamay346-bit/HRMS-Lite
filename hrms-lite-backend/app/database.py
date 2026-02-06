import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv
load_dotenv()


# Use env var for deployment.
# Format: mysql+pymysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
#
# IMPORTANT:
# - In production (Render), always set DATABASE_URL.
# - For local development, if DATABASE_URL is NOT set, we fall back to SQLite
#   to avoid hardcoding MySQL credentials in code.
# DATABASE_URL = os.getenv("DATABASE_URL")
# if not DATABASE_URL:
#     DATABASE_URL = "sqlite:///./hrms_lite.db"
DATABASE_URL = "mysql+pymysql://root:Tanamay%4012345@localhost:3306/hrms_lite"


engine = create_engine(
    DATABASE_URL,
    echo=False,          # quieter logs for production readiness
    pool_pre_ping=True,  # better resilience for dropped connections
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

print("DB URL IN USE:", DATABASE_URL)
