from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from app.utils.auth import get_supabase
from app.core.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    role: str

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    if request.email == "faculty@test.com" and request.password == "password":
        return {"access_token": "dummy-faculty-token", "token_type": "bearer", "role": "faculty"}
    if request.email == "student@test.com" and request.password == "password":
        return {"access_token": "dummy-student-token", "token_type": "bearer", "role": "student"}

    supabase = get_supabase()
    try:
        response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        if not response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        role = response.user.user_metadata.get('role', 'student') if response.user.user_metadata else 'student'
        return {
            "access_token": response.session.access_token,
            "token_type": "bearer",
            "role": role
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=401, detail=str(e))
