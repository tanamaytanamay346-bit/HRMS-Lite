from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError

from app.database import Base, engine
from app.models import attendance, employee  # ensure models are imported so metadata knows them
from app.routes import attendance as attendance_routes
from app.routes import employee as employee_routes

app = FastAPI(title="HRMS Lite Backend")

# Return a clean response instead of 500 stack traces when DB is down/misconfigured
@app.exception_handler(OperationalError)
async def sqlalchemy_operational_error_handler(request: Request, exc: OperationalError):
    return JSONResponse(
        status_code=503,
        content={
            "detail": "Database unavailable. Check DATABASE_URL and database permissions.",
        },
    )

# Basic CORS so the deployed frontend can call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can tighten this later to specific frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all DB tables based on SQLAlchemy models
# Use startup event to create tables, so app can start even if DB is temporarily unavailable
@app.on_event("startup")
async def startup_event():
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created/verified successfully")
    except Exception as e:
        print(f"Warning: Could not create database tables on startup: {e}")
        print("App will continue, but database operations may fail until connection is established")

app.include_router(employee_routes.router, prefix="/employees", tags=["Employees"])
app.include_router(attendance_routes.router, prefix="/attendance", tags=["Attendance"])

@app.get("/")
def root():
    return {"message": "HRMS Lite Backend API", "status": "running"}

@app.get("/health")
def health_check():
    """Health check endpoint for deployment platforms"""
    try:
        # Test database connection
        from sqlalchemy import text
        from app.database import engine
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}

