from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.core.config import settings
from supabase import create_client, Client
import os

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_supabase() -> Client:
    # Use service key for admin backend tasks to bypass RLS when acting on behalf of authorized user
    url = settings.SUPABASE_URL
    key = settings.SUPABASE_KEY
    if not url or not key:
        raise ValueError("Supabase credentials are not configured")
    return create_client(url, key)

async def verify_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        supabase = get_supabase()
        # verify token with supabase using user's access token directly
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise credentials_exception
        user = user_response.user
        role = user.user_metadata.get('role', 'student')
        return {
            "sub": user.id,
            "role": role,
            "email": user.email
        }
    except Exception as e:
        print(f"Token verification failed: {e}")
        # fallback to JWT decode if token is just a standard jwt (rare for supabase client but just in case)
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM], options={"verify_aud": False})
            user_id: str = payload.get("sub")
            role: str = payload.get("role", "student")
            if user_id is None:
                raise credentials_exception
            return {"sub": user_id, "role": role, "email": payload.get("email")}
        except JWTError:
            raise credentials_exception

async def get_current_user(token_data: dict = Depends(verify_token)):
    return token_data

async def get_current_faculty(user: dict = Depends(get_current_user)):
    if user.get("role") not in ["faculty", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return user

async def get_current_student(user: dict = Depends(get_current_user)):
    if user.get("role") != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return user
