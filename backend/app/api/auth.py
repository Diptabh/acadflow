from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import LoginRequest, Token, UserResponse
from app.services.supabase import get_supabase_client
from app.services.auth import create_access_token, verify_password, get_password_hash

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=Token)
async def login(request: LoginRequest):
    """
    Authenticate user with email and password.
    Returns JWT token and user info.
    """
    supabase = get_supabase_client()
    
    # Query users table for matching email
    response = supabase.table("users").select("*").eq("email", request.email).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    user = response.data[0]
    
    # Verify password (stored as bcrypt hash in the users table)
    # For Supabase Auth users, we need to use Supabase Auth API
    # This is a simplified version - in production, use Supabase Auth directly
    
    # Check if user has a password set (for manual auth setup)
    if "password_hash" in user and user["password_hash"]:
        if not verify_password(request.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not set up for password authentication"
        )
    
    # Create JWT token
    access_token = create_access_token(
        data={
            "sub": user["id"],
            "email": user["email"],
            "role": user["role"]
        }
    )
    
    return Token(
        access_token=access_token,
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            role=user["role"],
            created_at=user.get("created_at")
        )
    )


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(email: str, password: str, role: str = "student"):
    """
    Register a new user (admin only in production).
    """
    supabase = get_supabase_client()
    
    # Check if user exists
    existing = supabase.table("users").select("id").eq("email", email).execute()
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    password_hash = get_password_hash(password)
    
    # Create user
    response = supabase.table("users").insert({
        "email": email,
        "password_hash": password_hash,
        "role": role
    }).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
    
    user = response.data[0]
    return UserResponse(
        id=user["id"],
        email=user["email"],
        role=user["role"],
        created_at=user.get("created_at")
    )


@router.get("/me", response_model=UserResponse)
async def get_me(user_id: str, email: str, role: str):
    """
    Get current user info from token.
    """
    return UserResponse(
        id=user_id,
        email=email,
        role=role
    )
