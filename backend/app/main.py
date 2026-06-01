from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.students import router as students_router
from app.api.faculty import router as faculty_router
from app.api.subjects import router as subjects_router


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="Unified Assessment Automation Platform for Engineering Colleges",
        docs_url="/docs",
        redoc_url="/redoc",
    )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(auth_router)
    app.include_router(students_router)
    app.include_router(faculty_router)
    app.include_router(subjects_router)
    
    # Health check endpoint
    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "version": settings.APP_VERSION}
    
    @app.get("/")
    async def root():
        return {
            "message": "AcadFlow API",
            "version": settings.APP_VERSION,
            "docs": "/docs"
        }
    
    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
