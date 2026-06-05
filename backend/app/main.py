from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.students import router as students_router
from app.api.subjects import router as subjects_router
from app.api.sections import router as sections_router
from app.api.faculty import router as faculty_router
from app.api.ca3 import router as ca3_router
from app.api.uploads import router as uploads_router
from app.api.student_marks import router as student_marks_router
from app.api.ca2 import router as ca2_router

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.include_router(auth_router)
    app.include_router(students_router)
    app.include_router(subjects_router)
    app.include_router(sections_router)
    app.include_router(faculty_router)
    app.include_router(ca3_router)
    app.include_router(uploads_router)
    app.include_router(student_marks_router)
    app.include_router(ca2_router)
    
    @app.get("/")
    async def root():
        return {"message": "AcadFlow API"}
    
    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
