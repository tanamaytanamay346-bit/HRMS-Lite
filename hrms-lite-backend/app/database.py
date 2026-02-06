import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# Load environment variables (optional, can be empty for SQLite)
load_dotenv()

# Use DATABASE_URL from environment if set; else fallback to SQLite (college-friendly)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hrms_lite.db")

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    echo=False,          # quieter logs
    pool_pre_ping=True,  # auto handle dropped connections
)

# Session class for DB access
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

print("DB URL IN USE:", DATABASE_URL)
